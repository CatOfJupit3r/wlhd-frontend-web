import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import { io, Socket } from "socket.io-client";

import {
    fetchActions, resetInfo,
    selectChosenAction,
    selectIsTurnActive,
    selectReadyToSubmit,
    setReadyToSubmit
} from "../../redux/slices/turnSlice";
import Battlefield from "../Battlefield/Battlefield";
import ActionInput from "../ActionInput/ActionInput";
import {REACT_APP_BACKEND_URL} from "../../config/configs";
import {selectGameId, selectIsActive, selectName, setActive} from "../../redux/slices/gameSlice";
import {GameCommand, NewMessageCommand, TakeActionCommand} from "../../models/GameCommands";
import {setNotify} from "../../redux/slices/notifySlice";
import GameStateFeed from "../GameStateFeed/GameStateFeed";
import styles from "./GameScreen.module.css";
import {
    fetchAllEntitiesInfo,
    fetchAllMessages, fetchBattlefield, fetchTheMessage, selectEndInfo,
    selectRound, setEndInfo, setRound
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
    // const isLoadingActions = useSelector(selectIsLoadingCurrentActions)
    const roundCount = useSelector(selectRound)
    // const activeEntityInfo = useSelector(selectEntityInControlInfo)
    const endInfo = useSelector(selectEndInfo)
    // const currentAction = useSelector(selectCurrentActions)

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
            setTimeout(() => {
                navigate('..');
            }, 200);
        }
        document.title = t("local:game.title", {gameId: gameId}) === t("local:game.title") ? "Game" : t("local:game.title", {gameId: gameId})
        if (socketRef.current) { // If the socket is already connected, we don't need to connect again
            return
        }
        const socket = io(REACT_APP_BACKEND_URL, {
            reconnection: false,
            query: {
                game_id: gameId,
                user_token: username
            }
        });
        socketRef.current = socket
        socket.on("connect_error", () => {
            dispatch(setNotify({message: t("local:error"), code: 500}))
            setTimeout(() => {
                navigate('..');
            }, 200);
        })
        socket.on("connect", () => {
            console.log("Connected to game server");
            setTimeout(() => {
                socket.emit("start_combat")
            }, 200);
            (async () => {
                await dispatch(fetchBattlefield(gameId))
                await dispatch(fetchAllMessages(gameId))
            })()
        });
        socket.on("take_action", (data: TakeActionCommand) => {
            console.log(data)
            dispatch(fetchActions({
                game_id: gameId,
                entity_id: (data as any).entity_id,
            }))
                .finally(() => {
                    // console.log(currentAction)
                    socket.emit("debug")
                    // dispatch(setIsTurnActive({flag: true}))
                })
        })
        socket.on("battle_started", () => {
            (async () => {
                await dispatch(fetchBattlefield(gameId))
                await dispatch(fetchAllMessages(gameId))
                await dispatch(fetchAllEntitiesInfo(gameId))
            })().finally(() => {
                dispatch(setActive({isActive: true}))
            })
        });
        socket.on("round_update", (data: GameCommand) => {
            dispatch(setRound({round: data.payload?.round ? data.payload.round : 1}))
        });
        socket.on("new_message", (data: NewMessageCommand) => {
            dispatch(fetchTheMessage({game_id: gameId, message: data.payload.message}))
            dispatch(fetchAllEntitiesInfo(gameId))
        });
        socket.on("battlefield_updated", () => {
            dispatch(fetchBattlefield(gameId))
            dispatch(fetchAllEntitiesInfo(gameId))
        });
        socket.on("action_result", (data: any) => {
            try {
                dispatch(setNotify({
                    message: data.code === 200 ? t("local:success") : t("local:error"),
                        code: data.code
                }))
            } catch (e) {
                console.error("Error occurred during handling of socket: ", e)
            }
        });
        socket.on("battle_ended", (data: any) => {
            console.log("Game has ended")
            dispatch(setEndInfo({ended: true, winner: data.payload.battle_result}))
            dispatch(setActive({isActive: false}))
            socket.disconnect()
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
                setTimeout(() => {
                    navigate('..');
                }, 200);
            }
        })
    }, [username, gameId, dispatch, t, navigate, retries]);


    useEffect(() => {
        if (inputReadyToSubmit && submittedInput) {
            // socketEmitter("take_action", submittedInput)
            dispatch(setReadyToSubmit(false))
            dispatch(resetInfo())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch, socketEmitter]);

    // const ActiveScreen = useCallback(() => {
    //     return <>
    //         <h1 className={styles.roundHeader}>{t("local:game.round_n", {round: roundCount})}</h1>
    //         {
    //             // isTurn && !isLoadingActions && activeEntityInfo ?
    //             <h1>
    //                 {/*{t("local:game.its_your_turn", activeEntityInfo)}*/}
    //             </h1>
    //             :
    //             <h1>
    //                 {t("local:game.not_your_turn")}
    //             </h1>
    //         }
    //         <div id={"game-controller"} className={styles.gameControls}>
    //             <div id={"battle-info"} className={styles.battleInfo}>
    //                 <Battlefield />
    //                 <GameStateFeed />
    //             </div>
    //             {isTurn ?
    //                 // isLoadingActions ?
    //                     <h1>{t("local:game.pending.loading_actions")}</h1>
    //                     :
    //                     <>
    //                         <h1>
    //                             {/*{t("local:game.control_info", (() => {*/}
    //                             {/*    const result = activeEntityInfo*/}
    //                             {/*    if (result?.entity_name)*/}
    //                             {/*        result.entity_name = t(result.entity_name)*/}
    //                             {/*    return result*/}
    //                             {/*})())}*/}
    //                         </h1>
    //                         <ActionInput/>
    //                     </>
    //                 :
    //                null
    //             }
    //         </div>
    //     </>
    // }, [roundCount, isTurn, isLoadingActions, activeEntityInfo, t])

    return (
        endInfo && endInfo.ended // if the game has ended, we show the end screen
            ?
            <Overlay row={false}>
                <h1>{t("local:game.end.title")}</h1>
                <h1>{t("local:game.end.result", {result: endInfo.winner})}</h1>
                <button onClick={() => {
                    navigate("..")
                }}>{t("local:game.end.exit")}</button>
            </Overlay>
            : // if the game has not ended, we show the game screen
            // isActive // if the game has started, we show the game screen
                // ?
                // ActiveScreen() // if the game has started, we show the game screen
                // : // if the game has not started, we show the loading screen
                <Overlay>
                    <h1>{t("local:game.pending.not_started")}</h1>
                    <Spinner animation="grow" role="status"/>
                </Overlay>
    )
}

export default GameScreen;