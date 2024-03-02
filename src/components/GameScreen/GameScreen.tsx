import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectIsTurnActive} from "../../redux/slices/turnSlice";
import Battlefield from "../Battlefield/Battlefield";
import ActionInput from "../ActionInput/ActionInput";
import GameStateFeed from "../GameStateFeed";
import { io, Socket } from "socket.io-client";
import {REACT_APP_BACKEND_URL} from "../../config/configs";
import {StoreState} from "../../types/Redux";
import {selectGameId, selectIsActive, selectName, setActive} from "../../redux/slices/gameSlice";
import {getAllMessages, getGameField, getMemoryCell} from "../../services/apiServices";
import {ActionResultCommand, GameCommand, StateUpdatedCommand} from "../../types/GameCommands";

const GameScreen = () => {
    const dispatch = useDispatch()

    const username = useSelector(selectName)
    const isActive = useSelector(selectIsActive)
    const isTurn = useSelector(selectIsTurnActive)
    const gameId = useSelector(selectGameId)


    const [isLoading, setIsLoading] = useState(false)
    let socket: Socket | undefined = useMemo(() => undefined, []);

    const [currentBattlefield, setCurrentBattlefield] = useState({})
    const [currentGameState, setCurrentGameState] = useState({})
    const [currentActions, setCurrentActions] = useState({})
    const [allMessages, setAllMessages] = useState({})
    const [roundCount, setRoundCount] = useState(0)

    const addMessage = useCallback((message: {[key: string]: string[]}) => {
        setAllMessages((prev) => (
            {...prev, ...message}
            )
        )
    }, [allMessages])

    const countRound = useCallback(() => {
        setRoundCount((prev) => prev + 1)
    }, [roundCount])

    useEffect(() => {
        document.title = "Game Room - Nyrzamaer";
        if (socket !== undefined) { // this is to prevent multiple socket connections
            return
        }
        socket = io(REACT_APP_BACKEND_URL, {
            query: {
                game_id: "555",
                user_token: username
            }
        });
        socket.on("connect", () => {
            console.log("Connected to game server");
        });
        socket.on("take_action", (data: any) => {
            console.log("take_action", data);
            (socket as Socket).emit("message", {
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
            dispatch(setActive({isActive: true}))
            setIsLoading(true)
            getAllMessages(gameId).then((messages) => {
                setAllMessages(messages)
                setIsLoading(false)
            })
            getGameField(gameId).then((gameField) => {
                setCurrentBattlefield(gameField)
            })
        });
        socket.on("round_update", (data: GameCommand) => {
            setRoundCount(data.payload?.roundCount ? data.payload.roundCount : countRound())
        });
        socket.on("state_updated", (data: StateUpdatedCommand) => {
            getMemoryCell(gameId, data.payload.memory_cell).then((memoryCell) => {
                addMessage(memoryCell)
            })
        });
        socket.on("action_result", (data: ActionResultCommand) => {
            if (data.payload.code === 200) {
                console.log("Action successful")
            }
        });
        socket.on("game_finished", (data: any) => {
            console.log("game_finished", data);
        });
        socket.on("error", (data: any) => {
            console.error("error", data);
        });
    }, [username]);

    return (
            isActive
            ?
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
            :
            <h1>Waiting for server to start_game</h1>
    )
};

export default GameScreen;