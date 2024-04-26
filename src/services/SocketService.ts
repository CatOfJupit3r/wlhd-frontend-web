import { io, Socket } from 'socket.io-client'
import { REACT_APP_BACKEND_URL } from '../config/configs'
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
import { setNotify } from '../redux/slices/notifySlice'
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
    BATTLEFIELD_UPDATE: 'battlefield_update',
    ENTITIES_UPDATED: 'entities_updated',
}

const SOCKET_RESPONSES = {
    TAKE_ACTION: 'take_action',
    SKIP: 'skip',
}

export const ELEVATED_RIGHTS_RESPONSES = {
    ALLOCATE: 'allocate',
    START_COMBAT: 'start_combat',
    END_COMBAT: 'end_combat',
}

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
            query: {
                userToken: AuthManager.getAccessToken(),
            },
        })
        this.setupListeners()
    }

    private addEventListener(event: string, callback: (...args: any[]) => void) {
        this.socket.on(event, callback)
        console.log('Added listener for', event)
    }

    private removeEventListener(event: string, callback: (...args: any[]) => void) {
        this.socket.off(event, callback)
    }

    public emit(event: string, data?: any) {
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
        this.socket.io.opts.query = { ...this.socket.io.opts.query, lobbyId, combatId }
        this.socket.connect()
    }

    private reconnect() {
        this.socket.connect()
    }

    private setupListeners() {
        const listeners = [
            {
                event: 'connect',
                callback: () => {
                    console.log('Connected to socket')
                },
            },
            {
                event: 'disconnect',
                callback: () => {
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
            },
            {
                event: 'invalid_token',
                callback: () => {
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
            },
            {
                event: 'error',
                callback: (error: unknown) => {
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
            },
            {
                event: SOCKET_EVENTS.ACTION_RESULT,
                callback: ({ code, message }: ActionResultsPayload) => {
                    console.log('Action result', code, message)
                    ReduxStore.dispatch(setNotify({ code, message }))
                },
            },
            {
                event: SOCKET_EVENTS.HALT_ACTION,
                callback: () => {
                    // this action stops any further action from being taken.
                    // emitted to avoid users from taking actions when they shouldn't no longer
                    console.log('Halted action')
                    ReduxStore.dispatch(resetTurnSlice())
                },
            },
            {
                event: SOCKET_EVENTS.BATTLE_ENDED,
                callback: ({ battle_result }: { battle_result: string }) => {
                    console.log('Battle ended', battle_result)
                    ReduxStore.dispatch(setFlowToEnded(battle_result))
                },
            },
            {
                event: SOCKET_EVENTS.CURRENT_ENTITY_UPDATED,
                callback: (activeEntityInfo: EntityInfoTurn) => {
                    console.log('Current entity updated', activeEntityInfo)
                    ReduxStore.dispatch(setActiveEntity(activeEntityInfo))
                },
            },
            {
                event: SOCKET_EVENTS.NO_CURRENT_ENTITY,
                callback: () => {
                    console.log('No current entity')
                    ReduxStore.dispatch(resetActiveEntity())
                },
            },
            {
                event: SOCKET_EVENTS.BATTLEFIELD_UPDATE,
                callback: ({ battlefield }: { battlefield: Battlefield }) => {
                    ReduxStore.dispatch(setBattlefield(battlefield))
                },
            },
            {
                event: SOCKET_EVENTS.NEW_MESSAGE,
                callback: ({ message }: { message: Array<TranslatableString> }) => {
                    ReduxStore.dispatch(addMessage(message))
                },
            },
            {
                event: SOCKET_EVENTS.ROUND_UPDATE,
                callback: ({ roundCount }: { roundCount: string }) => {
                    ReduxStore.dispatch(setRound(roundCount))
                    console.log('Round update', roundCount)
                },
            },
            {
                event: SOCKET_EVENTS.BATTLE_STARTED,
                callback: () => {
                    ReduxStore.dispatch(setFlowToActive())
                },
            },
            {
                event: SOCKET_EVENTS.ENTITIES_UPDATED,
                callback: ({
                    newControlledEntities,
                    newTooltips,
                }: {
                    newControlledEntities: Array<EntityInfoFull>
                    newTooltips: { [square: string]: EntityInfoTooltip | null }
                }) => {
                    ReduxStore.dispatch(setControlledEntities(newControlledEntities))
                    ReduxStore.dispatch(setEntityTooltips(newTooltips))
                },
            },
            {
                event: SOCKET_EVENTS.GAME_HANDSHAKE,
                callback: (data: GameHandshake) => {
                    const DISPATCHES = [
                        {
                            type: resetGameComponentsStateAction,
                            payload: null,
                        },
                        {
                            type: setRound,
                            payload: data.roundCount,
                        },
                        {
                            type: setMessages,
                            payload: data.messages,
                        },
                        {
                            type: setBattlefield,
                            payload: data.currentBattlefield,
                        },
                        {
                            type: setActiveEntity,
                            payload: data.currentEntityInfo,
                        },
                        {
                            type: setEntityTooltips,
                            payload: data.entityTooltips,
                        },
                        {
                            type: setControlledEntities,
                            payload: data.controlledEntities,
                        },
                    ]
                    for (const { type, payload } of DISPATCHES) {
                        ReduxStore.dispatch(type(payload as any))
                    }
                    if (data.combatStatus === 'pending') {
                        ReduxStore.dispatch(setFlowToPending())
                    } else {
                        ReduxStore.dispatch(setFlowToActive())
                    }
                },
            },
            {
                event: SOCKET_EVENTS.TAKE_ACTION,
                callback: ({ actions }: { actions: ActionInput }) => {
                    try {
                        ReduxStore.dispatch(setEntityActions(actions))
                    } catch (e) {
                        console.log('Error occurred during fetching of actions: ', e)
                        this.emit(SOCKET_RESPONSES.SKIP)
                        return
                    }
                    ReduxStore.dispatch(setPlayersTurn(true))
                },
            },
            {
                event: '*',
                callback: (data: any) => {
                    console.log('Received unknown event', data)
                },
            },
        ]
        for (const { event, callback } of listeners) {
            this.addEventListener(event, callback)
        }
    }
}

export default new SocketService()
