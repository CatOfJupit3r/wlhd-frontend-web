import { io, Socket } from 'socket.io-client'
import { REACT_APP_BACKEND_URL } from '../config/configs'
import { ActionResultsPayload } from '../models/Events'
import { fetchBattlefield } from '../redux/slices/battlefieldSlice'
import { fetchAllEntitiesInfo, fetchTheMessage, setEndInfo, setRound } from '../redux/slices/infoSlice'
import { setNotify } from '../redux/slices/notifySlice'
import { fetchActions, setPlayersTurn } from '../redux/slices/turnSlice'
import { store as ReduxStore } from '../redux/store'

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

    constructor() {
        this.socket = io(REACT_APP_BACKEND_URL, {
            reconnection: false, // only manually reconnect
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
        this.socket.io.opts.query = { lobbyId, combatId }
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
                        // TODO: we signal that game is over.
                        this.retries = 3
                    }
                },
            },
            {
                event: SOCKET_EVENTS.ACTION_RESULT,
                callback: ({ code, message }: ActionResultsPayload) => {
                    console.log('Received action result', code, message)
                    ReduxStore.dispatch(setNotify({ code, message }))
                },
            },
            {
                event: SOCKET_EVENTS.HALT_ACTION,
                callback: () => {
                    // this action stops any further action from being taken.
                    // emitted to avoid users from taking actions when they shouldn't no longer
                    console.log('Halted action')
                },
            },
            {
                event: SOCKET_EVENTS.BATTLE_ENDED,
                callback: ({ battle_result }: { battle_result: string }) => {
                    console.log('Battle ended', battle_result)
                    ReduxStore.dispatch(setEndInfo({ ended: true, winner: battle_result }))
                },
            },
            {
                event: SOCKET_EVENTS.CURRENT_ENTITY_UPDATED,
                callback: (entityId: string) => {
                    // triggers action to fetch info of the current entity
                    console.log('Current entity updated', entityId)
                },
            },
            {
                event: SOCKET_EVENTS.NO_CURRENT_ENTITY,
                callback: () => {
                    // resets the current entity store entry to initialState
                    console.log('No current entity')
                },
            },
            {
                event: SOCKET_EVENTS.BATTLEFIELD_UPDATE,
                callback: () => {
                    this.combatId &&
                        (() => {
                            ReduxStore.dispatch(fetchBattlefield(this.combatId))
                            ReduxStore.dispatch(fetchAllEntitiesInfo(this.combatId))
                        })()
                },
            },
            {
                event: SOCKET_EVENTS.NEW_MESSAGE,
                callback: (message: string) => {
                    this.combatId &&
                        (() => {
                            ReduxStore.dispatch(
                                fetchTheMessage({
                                    game_id: this.combatId,
                                    message,
                                })
                            )
                            ReduxStore.dispatch(fetchAllEntitiesInfo(this.combatId))
                        })()
                },
            },
            {
                event: SOCKET_EVENTS.ROUND_UPDATE,
                callback: ({ round_count }: { round_count: number }) => {
                    ReduxStore.dispatch(setRound({ round: round_count ? round_count : '1' }))
                    console.log('Round update', round_count)
                },
            },
            {
                event: SOCKET_EVENTS.BATTLE_STARTED,
                callback: () => {
                    console.log('Battle started')
                },
            },
            {
                event: SOCKET_EVENTS.GAME_HANDSHAKE,
                callback: () => {
                    console.log('Game handshake')
                },
            },
            {
                event: SOCKET_EVENTS.TAKE_ACTION,
                callback: ({ entity_id }: { entity_id: string }) => {
                    this.combatId &&
                        (() => {
                            ReduxStore.dispatch(fetchBattlefield(this.combatId))
                            ReduxStore.dispatch(fetchAllEntitiesInfo(this.combatId))
                            ReduxStore.dispatch(
                                // add redux-thunk, cuz plain dispatch is not enough
                                fetchActions({
                                    game_id: this.combatId,
                                    entity_id: entity_id,
                                })
                            )
                                .then(() => {
                                    ReduxStore.dispatch(setPlayersTurn(true))
                                })
                                .catch((e) => {
                                    console.log('Error occurred during fetching of actions: ', e)
                                    this.emit(SOCKET_RESPONSES.SKIP)
                                })
                        })()
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
