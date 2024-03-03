import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    resetTurn,
    selectChosenAction,
    selectIsTurnActive,
    selectReadyToSubmit,
    setIsTurnActive, setReadyToSubmit
} from "../../redux/slices/turnSlice";
import Battlefield from "../Battlefield/Battlefield";
import ActionInput from "../ActionInput/ActionInput";
import { io, Socket } from "socket.io-client";
import {REACT_APP_BACKEND_URL} from "../../config/configs";
import {selectGameId, selectIsActive, selectName, setActive} from "../../redux/slices/gameSlice";
import {getActions, getAllMessages, getGameField, getMemoryCell} from "../../services/apiServices";
import {ActionResultCommand, GameCommand, StateUpdatedCommand, TakeActionCommand} from "../../types/GameCommands";
import {Battlefield as BattlefieldInterface} from "../../types/Battlefield";
import {ActionInput as ActionInputInterface} from "../../types/ActionInput";
import {setNotify} from "../../redux/slices/notifySlice";
import {useTranslation} from "react-i18next";
import {cmdToTranslation} from "../../utils/cmdConverters";
import {useNavigate} from "react-router-dom";

const GameScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {t} = useTranslation()

    const username = useSelector(selectName)
    const isActive = useSelector(selectIsActive)
    const isTurn = useSelector(selectIsTurnActive)
    const gameId = useSelector(selectGameId)
    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    const submittedInput = useSelector(selectChosenAction)

    const [isLoadingBattlefield, setIsLoadingBattlefield] = useState(false)
    const [isLoadingActions, setIsLoadingActions] = useState(false)

    const [currentBattlefield, setCurrentBattlefield] = useState({
        battlefield: [],
        game_descriptors: {
            columns: [],
            lines: [],
            connectors: "",
            separators: "",
            field_components: {}
        }
    } as BattlefieldInterface)
    // const [currentGameState, setCurrentGameState] = useState({})
    const [currentActions, setCurrentActions] = useState({} as ActionInputInterface)
    const [allMessages, setAllMessages] = useState({} as {[key: string]: string[]})
    const [roundCount, setRoundCount] = useState(0)

    const socketRef = useRef<Socket | null>(null);

    const socketEmitter = useCallback((command: string, payload: any) => {
        try {
            socketRef.current?.emit(command, payload)
        }
        catch (e) {
            console.error("Error occurred during emitting of socket: ", e)
        }
    }, [])

    const addMessage = useCallback((message: {[key: string]: string[]}) => {
        message ?
        setAllMessages((prev) => (
            {...prev, ...message}
            )
        )
        :
        console.error("Message is empty")
    }, [])

    const countRound = useCallback(() => {
        setRoundCount((prev) => prev + 1)
    }, [])

    useEffect(() => {
        document.title = "Game Room - Nyrzamaer";
        // Although eslint says, that socket is puffed after each render, it is not true
        // This code is executed only once, when the component is mounted to avoid connecting multiple times
        // eslint-disable-next-line
        while (!username || !gameId) { }
        if (socketRef.current) {
            return
        }
        const socket = io(REACT_APP_BACKEND_URL, {
            reconnection: false,
            query: {
                game_id: "555",
                user_token: username
            }
        });
        let retries: number = 3
        socketRef.current = socket
        socket.on("connect", () => {
            console.log("Connected to game server");
        });
        socket.on("take_action", (data: TakeActionCommand) => {
            setIsLoadingActions(true)
            getActions(gameId, data.payload.entity_id).then((actions) => {
                setCurrentActions(actions)
            }).finally(() => {
                setIsLoadingActions(false)
                dispatch(setIsTurnActive({flag: true}))
            })
        })
        socket.on("game_started", () => {
            dispatch(setActive({isActive: true}))
            setIsLoadingBattlefield(true)
            getAllMessages(gameId).then((messages) => {
                setAllMessages(messages)
            })
            getGameField(gameId).then((gameField) => {
                setCurrentBattlefield(gameField)
            }).finally(() => {
                setIsLoadingBattlefield(false)
            })
        });
        socket.on("round_update", (data: GameCommand) => {
            setRoundCount(data.payload?.roundCount ? data.payload.roundCount : countRound())
        });
        socket.on("state_updated", (data: StateUpdatedCommand) => {
            getMemoryCell(gameId, data.payload.memory_cell).then((memoryCell) => {
                addMessage(memoryCell)
                console.log(allMessages)
            })
            setIsLoadingBattlefield(true)
            getGameField(gameId).then((gameField) => {
                setCurrentBattlefield(gameField)
            }).finally(() => {
                setIsLoadingBattlefield(false)
            })
        });
        socket.on("action_result", (data: ActionResultCommand) => {
            dispatch(setNotify({
                message: data.payload.code === 200 ? t("builtins:success") : t("builtins:error"),
                    code: data.payload.code
            }))
        });
        socket.on("game_finished", (data: any) => {
            dispatch(setActive({isActive: false}))
        });
        socket.on("error", (data: any) => {
            console.error("Error occurred during handling of socket: ", data)
        });
        socket.on("disconnect", () => {
            console.log("Disconnected from game server");
            if (retries > 0) {
                console.log("Reconnecting...")
                retries--
                socket.connect()
            } else {
                console.error("Could not reconnect to game server")
                navigate("..")
            }
        })
    }, [username, gameId, dispatch, addMessage, countRound, allMessages, t, navigate]);

    useEffect(() => {
        if (inputReadyToSubmit && submittedInput) {
            socketEmitter("take_action", submittedInput)
            dispatch(setReadyToSubmit({flag: false}))
            dispatch(resetTurn())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch, socketEmitter]);

    return (
            isActive
            ?
            <>
                {
                    isLoadingBattlefield && currentBattlefield !== undefined ?
                        <h1>Loading battlefield...</h1>
                        :
                        <div id={"game-controller"} style={{
                            display: "flex",
                        }}>
                            <Battlefield battlefield={currentBattlefield}/>
                            {isTurn ?
                                isLoadingActions && currentActions !== undefined ?
                                    <h1>Loading actions...</h1>
                                    :
                                    <ActionInput actions={currentActions}/>
                                :
                                <h1>Not your turn!</h1>}
                        </div>
                }
            </>
            :
            <h1>Waiting for server to start_game</h1>
    )
};

export default GameScreen;