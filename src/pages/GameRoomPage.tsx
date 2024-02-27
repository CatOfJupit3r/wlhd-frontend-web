import React from 'react';
import Battlefield from "../components/Battlefield/Battlefield";
import {selectIsTurnActive} from "../redux/slices/turnSlice";
import store from "../redux/store";
import ActionInput from "../components/ActionInput/ActionInput";
import {useSelector} from "react-redux";


/*

The Game Room Page is the page where the game is played. It is the main page of the game and

When game haven't started, it will only show text "Waiting for server to start_game"
After this, socket will listen for commands from server:
    - start_game = web shows the game board and prepare the page for game
    - take_action = web gives user option to take action from given (for now, it will be in the form of select box)
    - end_game = displays game result and after 15 seconds return to root of site

 */



const GameRoomPage = () => {
    const isTurn = useSelector(selectIsTurnActive)

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
        }}>
            <Battlefield />
            {isTurn ?
            <ActionInput />
            :
            <h1>Not your turn!</h1>}
        </div>
    );
};

export default GameRoomPage;