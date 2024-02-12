/*

This service is used for handling socket connections and events.

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


export {}