import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import { io, Socket } from "socket.io-client";

import {
    fetchActions,
    resetTurn,
    selectChosenAction, selectEntityInControlInfo, selectIsLoadingCurrentActions,
    selectIsTurnActive,
    selectReadyToSubmit,
    setIsTurnActive, setReadyToSubmit
} from "../../redux/slices/turnSlice";
import Battlefield from "../Battlefield/Battlefield";
import ActionInput from "../ActionInput/ActionInput";
import {REACT_APP_BACKEND_URL} from "../../config/configs";
import {selectGameId, selectIsActive, selectName, setActive} from "../../redux/slices/gameSlice";
import {ActionResultCommand, GameCommand, StateUpdatedCommand, TakeActionCommand} from "../../models/GameCommands";
import {setNotify} from "../../redux/slices/notifySlice";
import GameStateFeed from "../GameStateFeed/GameStateFeed";
import styles from "./GameScreen.module.css";
import {
    fetchAllMessages, fetchBattlefield, fetchTheMessage,
    selectRound, setRound
} from "../../redux/slices/infoSlice";
import Overlay from "../Overlay/Overlay";
import {Spinner} from "react-bootstrap";
import {AppDispatch} from "../../redux/store";

const GameScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const {t} = useTranslation()

    const username = useSelector(selectName)
    const isActive = useSelector(selectIsActive)
    const isTurn = useSelector(selectIsTurnActive)
    const gameId = useSelector(selectGameId)
    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    const submittedInput = useSelector(selectChosenAction)
    const isLoadingActions = useSelector(selectIsLoadingCurrentActions)
    const roundCount = useSelector(selectRound)
    const activeEntityInfo = useSelector(selectEntityInControlInfo)

    let retries: number = useMemo(() => 3, [])

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
        if (!username || !gameId) { // If the user is not logged in or the game has not started, we redirect to the main page
            navigate('..')
        }
        document.title = t("local:game.title", {gameId: gameId}) === "local:game.title" ? "Game" : t("local:game.title", {gameId: gameId})
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
            dispatch(fetchActions({
                game_id: gameId,
                entity_id: data.payload.entity_id,
            }))
                .finally(() => {
                    dispatch(setIsTurnActive({flag: true}))
                })
        })
        socket.on("game_started", () => {
            (async () => {
                dispatch(fetchBattlefield(gameId))
                dispatch(fetchAllMessages(gameId))
            })().finally(() => {
                dispatch(setActive({isActive: true}))
            })
        });
        socket.on("round_update", (data: GameCommand) => {
            dispatch(setRound({round: data.payload?.round ? data.payload.round : 1}))
        });
        socket.on("state_updated", (data: StateUpdatedCommand) => {
            dispatch(fetchTheMessage({game_id: gameId, memory_cell: data.payload.memory_cell}))
            dispatch(fetchBattlefield(gameId))
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
    }, [username, gameId, dispatch, t, navigate, retries]);


    useEffect(() => {
        if (inputReadyToSubmit && submittedInput) {
            // socketEmitter("take_action", submittedInput)
            dispatch(setReadyToSubmit({flag: false}))
            dispatch(resetTurn())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch, socketEmitter]);

    return (
            isActive
            ?
            <>
                <h1 className={styles.roundHeader}>{t("local:game.round_n", {round: roundCount})}</h1>
                {
                    isTurn && !isLoadingActions && activeEntityInfo ?
                    <h1>
                        {t("local:its_your_turn.its_your_turn", activeEntityInfo)}
                    </h1>
                    :
                    <h1>
                        {t("local:game.not_your_turn")}
                    </h1>
                }
                <div id={"game-controller"} className={styles.gameControls}>
                    <div id={"battle-info"} className={styles.battleInfo}>
                        <Battlefield />
                        <GameStateFeed />
                    </div>
                    {isTurn ?
                        isLoadingActions ?
                            <h1>{t("local:game.pending.loading_actions")}</h1>
                            :
                            <>
                                <h1>
                                    {t("local:game.control_info", activeEntityInfo)}
                                </h1>
                                <ActionInput/>
                            </>
                        :
                       null
                    }
                </div>
            </>
            :
            <Overlay>
                <h1>{t("local:game.pending.not_started")}</h1>
                <Spinner animation="grow" role="status"/>
            </Overlay>
    )
};

export default GameScreen;