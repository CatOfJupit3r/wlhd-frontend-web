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
                game_id: "555",
                user_token: "ADMIN"
            }
        });
        socket.on("connect", () => {
            console.log("Connected to game server");
        });
        socket.on("take_action", (data: any) => {
            console.log("take_action", data);
            socket.emit("message", {
                "command": "take_action",
                "payload": {
                    "user_token": "ADMIN",
                    "action": {
                        "action": "skip_turn"
                    }
                }
            })
        })
        socket.on("game_started", () => {
            console.log("Game started");
        });
        socket.on("round_update", (data: any) => {
            console.log("round_update", data);
        });
        socket.on("state_updated", (data: any) => {
            console.log("state_updated", data);
        });
        socket.on("action_result", (data: any) => {
            console.log("action_result", data);
        });
        socket.on("game_finished", (data: any) => {
            console.log("game_finished", data);
        });
        socket.on("error", (data: any) => {
            console.error("error", data);
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