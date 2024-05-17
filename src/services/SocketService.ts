import { io, Socket } from 'socket.io-client'
import { REACT_APP_BACKEND_URL } from '../config'
import { ActionInput } from '../models/ActionInput'
import {
    Battlefield,
    EntityInfoFull,
    EntityInfoTooltip,
    EntityInfoTurn,
    TranslatableString,
} from '../models/Battlefield'
import { ActionResultsPayload } from '../models/Events'
import { GameHandshake } from '../models/GameHandshake'
import { resetGameComponentsStateAction } from '../redux/highActions'
import { setBattlefield } from '../redux/slices/battlefieldSlice'
import { setNotify } from '../redux/slices/cosmeticsSlice'
import {
    addMessage,
    resetActiveEntity,
    setActiveEntity,
    setControlledEntities,
    setEntityTooltips,
    setFlowToAborted,
    setFlowToActive,
    setFlowToEnded,
    setFlowToPending,
    setMessages,
    setRound,
} from '../redux/slices/infoSlice'
import { resetTurnSlice, setEntityActions, setPlayersTurn } from '../redux/slices/turnSlice'
import { store as ReduxStore } from '../redux/store'
import APIService from './APIService'
import AuthManager from './AuthManager'

const SOCKET_EVENTS = {
    BATTLE_STARTED: 'battle_started',
    ROUND_UPDATE: 'round_update',
    GAME_HANDSHAKE: 'game_handshake',
    ACTION_RESULT: 'action_result',
    BATTLE_ENDED: 'battle_ended',
    CURRENT_ENTITY_UPDATED: 'current_entity_updated',
    NO_CURRENT_ENTITY: 'no_current_entity',
    HALT_ACTION: 'halt_action',
    TAKE_ACTION: 'take_action',
    NEW_MESSAGE: 'new_message',
    BATTLEFIELD_UPDATE: 'battlefield_updated',
    ENTITIES_UPDATED: 'entities_updated',
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
        this.socket = io(REACT_APP_BACKEND_URL, {
            autoConnect: false,
            reconnection: false, // only manually reconnect
        })
    }

    private addBatchOfEventsListener(listeners: { [key: string]: (...args: any[]) => void }) {
        for (const [event, callback] of Object.entries(listeners)) {
            this.socket.removeListener(event)
            this.socket.on(event, callback)
        }
    }

    public emit(event: string, data?: unknown) {
        this.socket.emit(event, data)
    }

    private disconnect() {
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
                if (currentState.info.gameFlow.type !== 'ended') {
                    ReduxStore.dispatch(setFlowToAborted('local:game.disconnected'))
                }
                if (currentState.info.gameFlow.type === 'active') {
                    ReduxStore.dispatch(resetGameComponentsStateAction())
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
            error: (error: unknown) => {
                console.error('Socket error', error)
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
            [SOCKET_EVENTS.ACTION_RESULT]: ({ code, message }: ActionResultsPayload) => {
                console.log('Action result', code, message)
                ReduxStore.dispatch(setNotify({ code, message }))
            },
            [SOCKET_EVENTS.HALT_ACTION]: () => {
                // this action stops any further action from being taken.
                // emitted to avoid users from taking actions when they shouldn't no longer
                console.log('Halted action')
                ReduxStore.dispatch(resetTurnSlice())
            },
            [SOCKET_EVENTS.BATTLE_ENDED]: ({ battle_result }: { battle_result: string }) => {
                console.log('Battle ended', battle_result)
                ReduxStore.dispatch(setFlowToEnded(battle_result))
            },
            [SOCKET_EVENTS.CURRENT_ENTITY_UPDATED]: ({ activeEntity }: { activeEntity: EntityInfoTurn }) => {
                console.log('Current entity updated', activeEntity)
                ReduxStore.dispatch(setActiveEntity(activeEntity))
            },
            [SOCKET_EVENTS.NO_CURRENT_ENTITY]: () => {
                console.log('No current entity')
                ReduxStore.dispatch(resetActiveEntity())
            },
            [SOCKET_EVENTS.BATTLEFIELD_UPDATE]: ({ battlefield }: { battlefield: Battlefield }) => {
                ReduxStore.dispatch(setBattlefield(battlefield))
            },
            [SOCKET_EVENTS.NEW_MESSAGE]: ({ message }: { message: Array<TranslatableString> }) => {
                ReduxStore.dispatch(addMessage(message))
            },
            [SOCKET_EVENTS.ROUND_UPDATE]: ({ roundCount }: { roundCount: string }) => {
                ReduxStore.dispatch(setRound(roundCount))
                console.log('Round update', roundCount)
            },
            [SOCKET_EVENTS.BATTLE_STARTED]: () => {
                ReduxStore.dispatch(setFlowToActive())
            },
            [SOCKET_EVENTS.ENTITIES_UPDATED]: ({
                newControlledEntities,
                newTooltips,
            }: {
                newControlledEntities: Array<EntityInfoFull>
                newTooltips: { [_: string]: EntityInfoTooltip | null }
            }) => {
                ReduxStore.dispatch(setControlledEntities(newControlledEntities))
                ReduxStore.dispatch(setEntityTooltips(newTooltips))
            },
            [SOCKET_EVENTS.GAME_HANDSHAKE]: ({
                roundCount,
                messages,
                currentBattlefield,
                currentEntityInfo,
                entityTooltips,
                controlledEntities,
                combatStatus,
            }: GameHandshake) => {
                const DISPATCHES = [
                    {
                        type: resetGameComponentsStateAction,
                        payload: null,
                    },
                    {
                        type: setRound,
                        payload: roundCount,
                    },
                    {
                        type: setMessages,
                        payload: messages,
                    },
                    {
                        type: setBattlefield,
                        payload: currentBattlefield,
                    },
                    {
                        type: setActiveEntity,
                        payload: currentEntityInfo,
                    },
                    {
                        type: setEntityTooltips,
                        payload: entityTooltips,
                    },
                    {
                        type: setControlledEntities,
                        payload: controlledEntities,
                    },
                ]
                for (const { type, payload } of DISPATCHES) {
                    ReduxStore.dispatch(type(payload as any))
                }
                if (combatStatus === 'pending') {
                    ReduxStore.dispatch(setFlowToPending())
                } else {
                    ReduxStore.dispatch(setFlowToActive())
                }
            },
            [SOCKET_EVENTS.TAKE_ACTION]: ({ actions }: { actions: ActionInput }) => {
                try {
                    ReduxStore.dispatch(setEntityActions(actions))
                } catch (e) {
                    console.log('Error occurred during fetching of actions: ', e)
                    this.emit(SOCKET_RESPONSES.SKIP)
                    return
                }
                ReduxStore.dispatch(setPlayersTurn(true))
            },
            ['*']: (data: unknown) => {
                console.log('Received unknown event', data)
            },
        }
        this.addBatchOfEventsListener(listeners)
    }

    private setupElevatedRightsListeners() {
        const listeners = {
            [ELEVATED_RIGHTS_EVENTS.TAKE_UNALLOCATED_ACTION]: ({ actions }: { actions: ActionInput }) => {
                try {
                    ReduxStore.dispatch(setEntityActions(actions))
                } catch (e) {
                    console.log('Error occurred during fetching of actions: ', e)
                    this.emit(SOCKET_RESPONSES.SKIP)
                    return
                }
                ReduxStore.dispatch(setPlayersTurn(true))
            },
            [ELEVATED_RIGHTS_EVENTS.TAKE_OFFLINE_PLAYER_ACTION]: ({ actions }: { actions: ActionInput }) => {
                try {
                    ReduxStore.dispatch(setEntityActions(actions))
                } catch (e) {
                    console.log('Error occurred during fetching of actions: ', e)
                    this.emit(SOCKET_RESPONSES.SKIP)
                    return
                }
                ReduxStore.dispatch(setPlayersTurn(true))
            },
        }
        this.addBatchOfEventsListener(listeners)
    }
}

export default new SocketService()
