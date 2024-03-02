import io from 'socket.io-client';
import {Socket} from "socket.io-client";

/*
In plans:
- Connect to socket using authentication data.
- Disconnect from socket.
- Receive commands from socket server:
    - take_action - take action on the device;
    - game_start - change GameRoomPage to game mode;
    - game_end - change GameRoomPage to lobby mode;
    - state_update - update the state of the game.
- Send commands to socket server
- Handle errors.
 */

const connectToSocket = (gameId: string, userToken: string): Socket => {
    const socket = io('http://localhost:3001', {
        query: {
            game_id: gameId,
            user_token: userToken
        }
    });
    socket.on('connect', () => {
        console.log('Connected to game server');
    });
    socket.on('error', (data: any) => {
        console.error('error', data);
    });
    return socket;
}
