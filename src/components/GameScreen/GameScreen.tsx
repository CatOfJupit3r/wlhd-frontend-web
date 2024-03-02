import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {selectIsTurnActive} from "../../redux/slices/turnSlice";
import Battlefield from "../Battlefield/Battlefield";
import ActionInput from "../ActionInput/ActionInput";
import GameStateFeed from "../GameStateFeed";
import { io } from "socket.io-client";
import {REACT_APP_BACKEND_URL} from "../../config/configs";

const GameScreen = () => {
    const isTurn = useSelector(selectIsTurnActive)

    useEffect(() => {
        document.title = "Game Room";
        const socket = io(REACT_APP_BACKEND_URL, {
            query: {
                game_id: "test",
                user_token: "test"
            }
        });
        socket.on("connect", () => {
            socket.emit("message", {game_id: "test", user_token: "test"})
        });
    }, []);

    return (
        <>
            <div id={"game-controller"} style={{
                display: "flex",
            }}>
                <Battlefield />
                {isTurn ?
                    <ActionInput />
                    :
                    <h1>Not your turn!</h1>}
            </div>
            <GameStateFeed />
        </>
    )
};

export default GameScreen;