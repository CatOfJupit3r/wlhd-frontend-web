import { io, Socket } from 'socket.io-client'
import { REACT_APP_BACKEND_URL } from '../config/configs'
import { ActionResultsPayload } from '../models/Events'

class SocketService {
    private socket: Socket

    constructor() {
        this.socket = io(REACT_APP_BACKEND_URL, {
            reconnection: false, // only manually reconnect
        })
    }

    addEventListener(event: string, callback: (...args: any[]) => void) {
        this.socket.on(event, callback)
        console.log('Added listener for', event)
    }

    removeEventListener(event: string, callback: (...args: any[]) => void) {
        this.socket.off(event, callback)
    }

    emit(event: string, data: any) {
        this.socket.emit(event, data)
    }

    disconnect() {
        this.socket.disconnect()
    }

    connect({ lobbyId, combatId }: { lobbyId: string; combatId: string }) {
        // connect should only be called on /game-room
        // if (window.location.pathname !== '/game-room') {
        //     return
        // }
        this.socket.io.opts.query = {
            lobbyId: lobbyId,
            combatId: combatId,
        }
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
                callback: (error: any) => {
                    console.error('Socket error', error)
                },
            },
            {
                event: 'action_result',
                callback: ({ code, message }: ActionResultsPayload) => {
                    console.log('Received action result', code, message)
                    // dispatch(setNotify({ code, message }))
                },
            },
        ]
        for (const { event, callback } of listeners) {
            this.addEventListener(event, callback)
        }
    }
}

export default new SocketService()
