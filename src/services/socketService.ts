import io from 'socket.io-client';
import {Socket} from "socket.io";

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


const VERIFICATION = (game_id: string) => {
    return {
        "command": "add_socket",
        "payload": {
            "species": "web",
            game_id,
            "players": ["100001"]
        }
    }
}


export const connectToServer = () => {
    const socket = io();

    // Connect to the server
    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit("json_data", VERIFICATION("5000"));
    });

    return socket;
};

export const handleIncomingData = (socket: Socket, callback: (data: any) => void) => {
    socket.on('json_data', (data: any) => {
        console.log('Received JSON data:', data);
        callback(data);
    });
};

export const extractKeysFromJSON = (data: any): { command: string, keys: string[] } => {
    const command = data.command;
    const keys = Object.keys(data).filter(key => key !== 'command');
    return { command, keys };
};