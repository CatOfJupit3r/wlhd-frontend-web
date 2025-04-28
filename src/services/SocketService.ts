import { VITE_BACKEND_URL } from '@configuration';
import { ActionResultsPayload } from '@type-defs/Events';
import {
    Battlefield,
    CharacterInfoFull,
    GameHandshake,
    iCharacterActions,
    iGameLobbyState,
    IndividualTurnOrder,
    TranslatableString,
} from '@type-defs/GameModels';
import { createStore } from 'jotai';
import { io, Socket } from 'socket.io-client';

import { toastError } from '@components/toastifications';
import { actionsAtom, isYourTurnAtom } from '@jotai-atoms/actions-atom';
import { aoeAtom, battlefieldAtom, timestampAtom } from '@jotai-atoms/battlefield-atom';
import { gameFlowAtom, lobbyStateAtom } from '@jotai-atoms/game-lobby-meta-atom';
import {
    characterOrderAtom,
    controlledCharactersAtom,
    gameMessagesAtom,
    roundAtom,
} from '@jotai-atoms/game-screen-atom';

const SOCKET_EVENTS = {
    BATTLE_STARTED: 'battle_started',
    ROUND_UPDATE: 'round_update',
    GAME_HANDSHAKE: 'game_handshake',
    ACTION_RESULT: 'action_result',
    BATTLE_ENDED: 'battle_ended',
    NO_CURRENT_CHARACTER: 'no_current_character',
    HALT_ACTION: 'halt_action',
    TAKE_ACTION: 'take_action',
    NEW_MESSAGE: 'new_message',
    BATTLEFIELD_UPDATE: 'battlefield_updated',
    CHARACTERS_UPDATED: 'characters_updated',
    TURN_ORDER_UPDATED: 'turn_order_updated',
    GAME_LOBBY_STATE: 'game_lobby_state',
    ERROR: 'error',
    ACTION_TIMESTAMP: 'action_timestamp',
};

const ELEVATED_RIGHTS_EVENTS = {
    TAKE_UNALLOCATED_ACTION: 'take_unallocated_action',
    // if player is not present, but GM is, then GM can take action and is notified about unallocated character.
    TAKE_OFFLINE_PLAYER_ACTION: 'take_offline_player_action',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SOCKET_RESPONSES = {
    TAKE_ACTION: 'take_action',
    SKIP: 'skip',
};

export const ELEVATED_RIGHTS_RESPONSES = {
    ALLOCATE: 'allocate',
    START_COMBAT: 'start_combat',
    END_COMBAT: 'end_combat',
    TRY_SENDING_AGAIN: 'try_sending_again', // this event used to tell server to try sending action to the player again.
};

// these will be used by special actions in GM Menu

type JotaiStore = ReturnType<typeof createStore>;

class SocketService {
    private socket: Socket;
    private lobbyId: string | null = null;
    private combatId: string | null = null;
    private retries = 3;
    private triedToRefreshToken = false;
    private jotaiStore: JotaiStore;

    constructor(store: JotaiStore) {
        this.socket = io(VITE_BACKEND_URL, {
            autoConnect: false,
            reconnection: false, // only manually reconnect
            withCredentials: true, // better-auth cookies
        });
        this.jotaiStore = store;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private addBatchOfEventsListener(listeners: { [key: string]: (...args: any[]) => void }) {
        for (const [event, callback] of Object.entries(listeners)) {
            this.socket.removeListener(event);
            this.socket.on(event, callback);
        }
    }

    public emit(event: string, data?: unknown) {
        this.socket.emit(event, data);
    }

    public disconnect() {
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }

    public connect({ lobbyId, combatId, isGm = false }: { lobbyId: string; combatId: string; isGm?: boolean }) {
        // connect should only be called on /game-room
        // if (window.location.pathname !== '/game-room') {
        //     return
        // }
        if (this.lobbyId === lobbyId && this.combatId === combatId && this.socket.connected) {
            return;
        }
        this.lobbyId = lobbyId;
        this.combatId = combatId;
        if (this.socket.connected) {
            this.disconnect();
        }
        this.setupRegularListeners();
        if (isGm) {
            // if page displayed is for GM, then we can assume that user IS GM
            this.setupElevatedRightsListeners();
        }
        this.socket.io.opts.query = {
            ...this.socket.io.opts.query,
            // user token is fetched from cookies
            lobbyId,
            combatId,
        };
        this.socket.connect();
    }

    private reconnect() {
        this.socket.connect();
    }

    private setupRegularListeners() {
        const listeners = {
            connect: () => {
                console.log('Connected to socket');
            },
            disconnect: () => {
                console.log('Disconnected from socket');
                if (this.triedToRefreshToken) {
                    return;
                }
                const currentState = this.jotaiStore.get(gameFlowAtom);
                if (currentState.type !== 'ended') {
                    this.jotaiStore.set(gameFlowAtom, {
                        type: 'aborted',
                        details: 'local:game.disconnected',
                    });
                }
            },
            ['invalid_token']: () => {
                console.log('Invalid token');
                if (this.triedToRefreshToken) {
                    this.triedToRefreshToken = false;
                    console.log('Logging out user');
                } else {
                    this.triedToRefreshToken = true;
                }
                this.disconnect();
                this.jotaiStore.set(gameFlowAtom, {
                    type: 'aborted',
                    details: 'local:game.invalid_token',
                });
            },
            [SOCKET_EVENTS.ERROR]: (error: unknown) => {
                console.error('Socket error', error);
                if (error !== null && typeof error === 'object' && 'message' in error) {
                    toastError('Error', (error['message'] as string) ?? '???');
                    return;
                }
                if (this.retries > 0) {
                    console.log('Reconnecting...');
                    this.retries--;
                    this.reconnect();
                } else {
                    console.log('Could not reconnect to game server');
                    this.jotaiStore.set(gameFlowAtom, {
                        type: 'aborted',
                        details: 'local:game.connection_lost',
                    });
                    this.retries = 3;
                }
            },
            [SOCKET_EVENTS.GAME_LOBBY_STATE]: (gameLobbyState: iGameLobbyState) => {
                console.log('Game lobby state', gameLobbyState);
                this.jotaiStore.set(lobbyStateAtom, gameLobbyState);
            },
            [SOCKET_EVENTS.ACTION_RESULT]: ({ code, message }: ActionResultsPayload) => {
                console.log('Action result', code, message);
                if (code !== 200) {
                    toastError(message ?? 'local:game.action-error', 'bottom-left');
                }
            },
            [SOCKET_EVENTS.HALT_ACTION]: () => {
                // this action stops any further action from being taken.
                // emitted to avoid users from taking actions when they shouldn't no longer
                console.log('Halted action');
                this.jotaiStore.set(actionsAtom, null);
                this.jotaiStore.set(isYourTurnAtom, false);
            },
            [SOCKET_EVENTS.BATTLE_ENDED]: ({ battle_result }: { battle_result: string }) => {
                console.log('Battle ended', battle_result);
                this.jotaiStore.set(gameFlowAtom, {
                    type: 'ended',
                    details: battle_result,
                });
            },
            [SOCKET_EVENTS.TURN_ORDER_UPDATED]: ({ turnOrder }: { turnOrder: IndividualTurnOrder }) => {
                console.log('Turn order updated', turnOrder);
                this.jotaiStore.set(characterOrderAtom, turnOrder);
            },
            [SOCKET_EVENTS.BATTLEFIELD_UPDATE]: ({ battlefield }: { battlefield: Battlefield }) => {
                this.jotaiStore.set(battlefieldAtom, battlefield.pawns);
                this.jotaiStore.set(aoeAtom, battlefield.effects);
            },
            [SOCKET_EVENTS.NEW_MESSAGE]: ({ message }: { message: Array<TranslatableString> }) => {
                this.jotaiStore.set(gameMessagesAtom, (prev) => [...prev, message]);
            },
            [SOCKET_EVENTS.ROUND_UPDATE]: ({ roundCount }: { roundCount: number }) => {
                this.jotaiStore.set(roundAtom, roundCount);
                console.log('Round update', roundCount);
            },
            [SOCKET_EVENTS.BATTLE_STARTED]: () => {
                this.jotaiStore.set(gameFlowAtom, {
                    type: 'active',
                    details: '',
                });
            },
            [SOCKET_EVENTS.CHARACTERS_UPDATED]: ({
                newControlledCharacters,
            }: {
                newControlledCharacters: Array<CharacterInfoFull>;
            }) => {
                this.jotaiStore.set(controlledCharactersAtom, newControlledCharacters);
            },
            [SOCKET_EVENTS.ACTION_TIMESTAMP]: ({ timestamp }: { timestamp: number | null }) => {
                // ReduxStore.dispatch(setActionTimestamp(timestamp));
                this.jotaiStore.set(timestampAtom, timestamp);
            },
            [SOCKET_EVENTS.GAME_HANDSHAKE]: (handshake: GameHandshake) => {
                // meta
                this.jotaiStore.set(gameFlowAtom, {
                    type: handshake.combatStatus === 'pending' ? 'pending' : 'active',
                    details: '',
                });
                this.jotaiStore.set(lobbyStateAtom, handshake.gameLobbyState);

                // battlefield
                this.jotaiStore.set(battlefieldAtom, handshake.currentBattlefield.pawns);
                this.jotaiStore.set(aoeAtom, handshake.currentBattlefield.effects);
                this.jotaiStore.set(timestampAtom, handshake.actionTimestamp);

                // round
                this.jotaiStore.set(roundAtom, handshake.roundCount);
                this.jotaiStore.set(characterOrderAtom, handshake.turnOrder);

                // other
                this.jotaiStore.set(gameMessagesAtom, handshake.messages);
                this.jotaiStore.set(controlledCharactersAtom, handshake.controlledCharacters ?? []);
            },
            [SOCKET_EVENTS.TAKE_ACTION]: ({ actions }: { actions: iCharacterActions }) => {
                this.jotaiStore.set(actionsAtom, actions);
                this.jotaiStore.set(isYourTurnAtom, true);
            },
            ['*']: (data: unknown) => {
                console.log('Received unknown event', data);
            },
        };
        this.addBatchOfEventsListener(listeners);
        this.socket.onAny((event, data) => {
            console.debug('Received event', event, data);
        });
    }

    private setupElevatedRightsListeners() {
        const listeners = {
            [ELEVATED_RIGHTS_EVENTS.TAKE_UNALLOCATED_ACTION]: ({ actions }: { actions: iCharacterActions }) => {
                this.jotaiStore.set(actionsAtom, actions);
                this.jotaiStore.set(isYourTurnAtom, true);
            },
            [ELEVATED_RIGHTS_EVENTS.TAKE_OFFLINE_PLAYER_ACTION]: ({ actions }: { actions: iCharacterActions }) => {
                this.jotaiStore.set(actionsAtom, actions);
                this.jotaiStore.set(isYourTurnAtom, true);
            },
        };
        this.addBatchOfEventsListener(listeners);
    }
}

export default SocketService;
