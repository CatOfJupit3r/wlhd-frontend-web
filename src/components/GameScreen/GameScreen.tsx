import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import { io, Socket } from "socket.io-client";
import example_actions from "../../data/example_action.json";

import {
    resetTurn,
    selectChosenAction, selectIsLoadingCurrentActions,
    selectIsTurnActive,
    selectReadyToSubmit,
    setIsTurnActive, setReadyToSubmit
} from "../../redux/slices/turnSlice";
import Battlefield from "../Battlefield/Battlefield";
import ActionInput from "../ActionInput/ActionInput";
import {REACT_APP_BACKEND_URL} from "../../config/configs";
import {selectGameId, selectIsActive, selectName, setActive} from "../../redux/slices/gameSlice";
import {getActions, getAllMessages, getGameField, getMemoryCell} from "../../services/apiServices";
import {ActionResultCommand, GameCommand, StateUpdatedCommand, TakeActionCommand} from "../../models/GameCommands";
import {ActionInput as ActionInputInterface} from "../../models/ActionInput";
import {setNotify} from "../../redux/slices/notifySlice";
import GameStateFeed from "../GameStateFeed/GameStateFeed";
import styles from "./GameScreen.module.css";
import {selectIsLoadingBattlefield, selectRound} from "../../redux/slices/infoSlice";

const GameScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {t} = useTranslation()

    const username = useSelector(selectName)
    const isActive = useSelector(selectIsActive)
    const isTurn = useSelector(selectIsTurnActive)
    const isLoadingBattlefield = useSelector(selectIsLoadingBattlefield)
    dispatch(setActive({isActive: true})) // dev
    const gameId = useSelector(selectGameId)
    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    const submittedInput = useSelector(selectChosenAction)
    const isLoadingActions = useSelector(selectIsLoadingCurrentActions)
    const roundCount = useSelector(selectRound)

    dispatch(setIsTurnActive({flag: true})) // dev

    let retries: number = useMemo(() => 3, [])

    // const [currentBattlefield, setCurrentBattlefield] = useState({
    //     battlefield: (() => {
    //         return Array(6).fill(0).map(() => Array(6).fill("0"));
    //     })(),
    //     game_descriptors: {
    //         columns: ["builtins::one", "builtins::two", "builtins::three", "builtins::four", "builtins::five", "builtins::six"],
    //         lines: ["builtins::safe", "builtins::ranged", "builtins::melee", "builtins::melee", "builtins::safe", "builtins::safe"],
    //         connectors: "builtins::connector",
    //         separators: "builtins::separator",
    //         field_components: {"0": "builtins::tile"}
    //     }
    // } as BattlefieldInterface)

    /*  // dev

    const socketRef = useRef<Socket | null>(null);

    const socketEmitter = useCallback((command: string, payload: any) => {
        try {
            socketRef.current?.emit(command, payload)
        }
        catch (e) {
            console.error("Error occurred during emitting of socket: ", e)
        }
    }, [])

    useEffect(() => {
        document.title = "Game Room - Nyrzamaer";
        if (!username || !gameId) { // If the user is not logged in or the game has not started, we redirect to the main page
            navigate('..')
        }
        if (socketRef.current) { // If the socket is already connected, we don't need to connect again
            return
        }
        const socket = io(REACT_APP_BACKEND_URL, {
            reconnection: false,
            query: {
                game_id: "555",
                user_token: username
            }
        });
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
                message: data.payload.code === 200 ? t("local:success") : t("local:error"),
                    code: data.payload.code
            }))
        });
        socket.on("game_finished", (_: any) => {
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
    }, [username, gameId, dispatch, addMessage, countRound, allMessages, t, navigate, retries]);

     */
    useEffect(() => {
        if (inputReadyToSubmit && submittedInput) {
            // socketEmitter("take_action", submittedInput)
            dispatch(setReadyToSubmit({flag: false}))
            dispatch(resetTurn())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch]); // dev
    // }, [inputReadyToSubmit, submittedInput, dispatch, socketEmitter]);

    return (
            isActive
            ?
            <>
                {
                    isLoadingBattlefield ?
                        <h1>Loading battlefield...</h1>
                        :
                        <h1>Round {roundCount}</h1>
                }
                <div id={"game-controller"} className={styles.gameControls}>
                    <div id={"battle-info"} className={styles.battleInfo}>
                        <Battlefield/>
                        <GameStateFeed />
                    </div>
                    {isTurn ?
                        isLoadingActions ?
                            <h1>Loading actions...</h1>
                            :
                            <ActionInput/>
                        :
                        <h1>Not your turn!</h1>
                    }
                </div>
            </>
            :
            <h1>{t("local:game.pending.not_started")}</h1>
    )
};

export default GameScreen;