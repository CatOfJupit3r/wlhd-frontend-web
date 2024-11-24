import { toast } from '@hooks/useToast'
import { ActionResultsPayload } from '@models/Events'
import {
    Battlefield,
    EntityInfoFull,
    GameHandshake,
    iCharacterActions,
    iGameLobbyState,
    IndividualTurnOrder,
    TranslatableString,
} from '@models/GameModels'
import {
    addMessage,
    haltActions,
    resetGameScreenSlice,
    setActions,
    setActionTimestamp,
    setBattlefield,
    setControlledEntities,
    setFlowToAborted,
    setFlowToActive,
    setFlowToEnded,
    setGameLobbyState,
    setGameScreenSliceFromHandshake,
    setRound,
    setTurnOrder,
    setYourTurn,
} from '@redux/slices/gameScreenSlice'
import { store as ReduxStore } from '@redux/store'
import { VITE_BACKEND_URL } from 'config'
import { io, Socket } from 'socket.io-client'
import APIService from './APIService'
import AuthManager from './AuthManager'

const SOCKET_EVENTS = {
    BATTLE_STARTED: 'battle_started',
    ROUND_UPDATE: 'round_update',
    GAME_HANDSHAKE: 'game_handshake',
    ACTION_RESULT: 'action_result',
    BATTLE_ENDED: 'battle_ended',
    NO_CURRENT_ENTITY: 'no_current_entity',
    HALT_ACTION: 'halt_action',
    TAKE_ACTION: 'take_action',
    NEW_MESSAGE: 'new_message',
    BATTLEFIELD_UPDATE: 'battlefield_updated',
    ENTITIES_UPDATED: 'entities_updated',
    TURN_ORDER_UPDATED: 'turn_order_updated',
    GAME_LOBBY_STATE: 'game_lobby_state',
    ERROR: 'error',
    ACTION_TIMESTAMP: 'action_timestamp',
}

const ELEVATED_RIGHTS_EVENTS = {
    TAKE_UNALLOCATED_ACTION: 'take_unallocated_action',
    // if player is not present, but GM is, then GM can take action and is notified about unallocated entity.
    TAKE_OFFLINE_PLAYER_ACTION: 'take_offline_player_action',
}

const SOCKET_RESPONSES = {
    TAKE_ACTION: 'take_action',
    SKIP: 'skip',
}

export const ELEVATED_RIGHTS_RESPONSES = {
    ALLOCATE: 'allocate',
    START_COMBAT: 'start_combat',
    END_COMBAT: 'end_combat',
    TRY_SENDING_AGAIN: 'try_sending_again', // this event used to tell server to try sending action to the player again.
}

// these will be used by special actions in GM Menu

class SocketService {
    private socket: Socket
    private lobbyId: string | null = null
    private combatId: string | null = null
    private retries = 3
    private triedToRefreshToken = false

    constructor() {
        this.socket = io(VITE_BACKEND_URL, {
            autoConnect: false,
            reconnection: false, // only manually reconnect
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private addBatchOfEventsListener(listeners: { [key: string]: (...args: any[]) => void }) {
        for (const [event, callback] of Object.entries(listeners)) {
            this.socket.removeListener(event)
            this.socket.on(event, callback)
        }
    }

    public emit(event: string, data?: unknown) {
        this.socket.emit(event, data)
    }

    public disconnect() {
        this.socket.disconnect()
    }

    public connect({ lobbyId, combatId }: { lobbyId: string; combatId: string }) {
        // connect should only be called on /game-room
        // if (window.location.pathname !== '/game-room') {
        //     return
        // }
        if (this.lobbyId === lobbyId && this.combatId === combatId && this.socket.connected) {
            return
        }
        this.lobbyId = lobbyId
        this.combatId = combatId
        if (this.socket.connected) {
            this.disconnect()
        }
        this.setupRegularListeners()
        if (ReduxStore.getState().lobby.layout === 'gm') {
            // if page displayed is for GM, then we can assume that user IS GM
            this.setupElevatedRightsListeners()
        }
        this.socket.io.opts.query = {
            ...this.socket.io.opts.query,
            userToken: AuthManager.getAccessToken(),
            lobbyId,
            combatId,
        }
        this.socket.connect()
    }

    private reconnect() {
        this.socket.connect()
    }

    private setupRegularListeners() {
        const listeners = {
            connect: () => {
                console.log('Connected to socket')
            },
            disconnect: () => {
                console.log('Disconnected from socket')
                if (this.triedToRefreshToken) {
                    return
                }
                const currentState = ReduxStore.getState()
                if (currentState.gameScreen.gameFlow.type !== 'ended') {
                    ReduxStore.dispatch(setFlowToAborted('local:game.disconnected'))
                }
                if (currentState.gameScreen.gameFlow.type === 'active') {
                    ReduxStore.dispatch(resetGameScreenSlice())
                }
            },
            ['invalid_token']: () => {
                console.log('Invalid token')
                if (this.triedToRefreshToken) {
                    this.triedToRefreshToken = false
                    console.log('Logging out user')
                    ReduxStore.dispatch(setFlowToAborted('local:game.invalid_token'))
                } else {
                    this.triedToRefreshToken = true
                    APIService.refreshToken().then(() => {
                        this.reconnect()
                    })
                }
            },
            [SOCKET_EVENTS.ERROR]: (error: unknown) => {
                console.error('Socket error', error)
                if (error !== null && typeof error === 'object' && 'message' in error) {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: (error['message'] as string) ?? '???',
                        position: 'top-center',
                    })
                    return
                }
                if (this.retries > 0) {
                    console.log('Reconnecting...')
                    this.retries--
                    this.reconnect()
                } else {
                    console.log('Could not reconnect to game server')
                    ReduxStore.dispatch(setFlowToAborted('local:game.connection_lost'))
                    this.retries = 3
                }
            },
            [SOCKET_EVENTS.GAME_LOBBY_STATE]: (gameLobbyState: iGameLobbyState) => {
                console.log('Game lobby state', gameLobbyState)
                ReduxStore.dispatch(setGameLobbyState(gameLobbyState))
            },
            [SOCKET_EVENTS.ACTION_RESULT]: ({ code, message }: ActionResultsPayload) => {
                console.log('Action result', code, message)
                toast({
                    variant: code === 200 ? 'default' : 'destructive',
                    title: code === 200 ? 'Success' : 'Error',
                    description: code === 200 ? 'local:game.actionSuccess' : (message ?? 'local:game.actionError'),
                    position: code === 200 ? 'bottom-left' : 'top-center',
                })
            },
            [SOCKET_EVENTS.HALT_ACTION]: () => {
                // this action stops any further action from being taken.
                // emitted to avoid users from taking actions when they shouldn't no longer
                console.log('Halted action')
                ReduxStore.dispatch(haltActions())
            },
            [SOCKET_EVENTS.BATTLE_ENDED]: ({ battle_result }: { battle_result: string }) => {
                console.log('Battle ended', battle_result)
                ReduxStore.dispatch(setFlowToEnded(battle_result))
            },
            [SOCKET_EVENTS.TURN_ORDER_UPDATED]: ({ turnOrder }: { turnOrder: IndividualTurnOrder }) => {
                console.log('Turn order updated', turnOrder)
                ReduxStore.dispatch(setTurnOrder(turnOrder))
            },
            [SOCKET_EVENTS.BATTLEFIELD_UPDATE]: ({ battlefield }: { battlefield: Battlefield }) => {
                ReduxStore.dispatch(setBattlefield(battlefield))
            },
            [SOCKET_EVENTS.NEW_MESSAGE]: ({ message }: { message: Array<TranslatableString> }) => {
                ReduxStore.dispatch(addMessage(message))
            },
            [SOCKET_EVENTS.ROUND_UPDATE]: ({ roundCount }: { roundCount: number }) => {
                ReduxStore.dispatch(setRound(roundCount))
                console.log('Round update', roundCount)
            },
            [SOCKET_EVENTS.BATTLE_STARTED]: () => {
                ReduxStore.dispatch(setFlowToActive())
            },
            [SOCKET_EVENTS.ENTITIES_UPDATED]: ({
                newControlledEntities,
            }: {
                newControlledEntities: Array<EntityInfoFull>
            }) => {
                ReduxStore.dispatch(setControlledEntities(newControlledEntities))
            },
            [SOCKET_EVENTS.ACTION_TIMESTAMP]: ({ timestamp }: { timestamp: number | null }) => {
                ReduxStore.dispatch(setActionTimestamp(timestamp))
            },
            [SOCKET_EVENTS.GAME_HANDSHAKE]: (handshake: GameHandshake) => {
                ReduxStore.dispatch(setGameScreenSliceFromHandshake(handshake))
            },
            [SOCKET_EVENTS.TAKE_ACTION]: ({ actions }: { actions: iCharacterActions }) => {
                try {
                    ReduxStore.dispatch(setActions(actions))
                } catch (e) {
                    console.log('Error occurred during fetching of actions: ', e)
                    this.emit(SOCKET_RESPONSES.SKIP)
                    return
                }
                ReduxStore.dispatch(setYourTurn(true))
            },
            ['*']: (data: unknown) => {
                console.log('Received unknown event', data)
            },
        }
        this.addBatchOfEventsListener(listeners)
    }

    private setupElevatedRightsListeners() {
        const listeners = {
            [ELEVATED_RIGHTS_EVENTS.TAKE_UNALLOCATED_ACTION]: ({ actions }: { actions: iCharacterActions }) => {
                try {
                    ReduxStore.dispatch(setActions(actions))
                } catch (e) {
                    console.log('Error occurred during fetching of actions: ', e)
                    this.emit(SOCKET_RESPONSES.SKIP)
                    return
                }
                ReduxStore.dispatch(setYourTurn(true))
            },
            [ELEVATED_RIGHTS_EVENTS.TAKE_OFFLINE_PLAYER_ACTION]: ({ actions }: { actions: iCharacterActions }) => {
                try {
                    ReduxStore.dispatch(setActions(actions))
                } catch (e) {
                    console.log('Error occurred during fetching of actions: ', e)
                    this.emit(SOCKET_RESPONSES.SKIP)
                    return
                }
                ReduxStore.dispatch(setYourTurn(true))
            },
        }
        this.addBatchOfEventsListener(listeners)
    }
}

export default new SocketService()
