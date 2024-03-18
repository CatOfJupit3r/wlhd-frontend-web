import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import {
    fetchActions,
    resetInput,
    selectIsTurnActive,
    selectReadyToSubmit, setEntityActions,
    setReadyToSubmit
} from "../../redux/slices/turnSlice";
import Battlefield from "../Battlefield/Battlefield";
import ActionInput from "../ActionInput/ActionInput";
import {REACT_APP_BACKEND_URL} from "../../config/configs";
import {selectGameId, selectIsActive, selectName, setActive} from "../../redux/slices/gameSlice";
import {GameCommand, NewMessageCommand, TakeActionCommand} from "../../models/GameCommands";
import {setNotify} from "../../redux/slices/notifySlice";
import GameStateFeed from "../GameStateFeed/GameStateFeed";
import styles from "./DebugScreen.module.css";
import {
    fetchAllEntitiesInfo,
    fetchAllMessages, fetchBattlefield, fetchTheMessage, selectEndInfo, selectEntityInControlInfo,
    selectRound, setEndInfo, setRound
} from "../../redux/slices/infoSlice";
import Overlay from "../Overlay/Overlay";
import {Spinner} from "react-bootstrap";
import {AppDispatch} from "../../redux/store";
import example from "../../data/example_action.json"


const DebugScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const {t} = useTranslation()

    const username = useSelector(selectName)
    const isActive = useSelector(selectIsActive)
    const isTurn = useSelector(selectIsTurnActive)
    const gameId = useSelector(selectGameId)
    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    // const submittedInput = useSelector(selectChosenAction)
    // const isLoadingActions = useSelector(selectIsLoadingCurrentActions)
    const roundCount = useSelector(selectRound)
    const activeEntityInfo = useSelector(selectEntityInControlInfo)
    const endInfo = useSelector(selectEndInfo)
    // const currentAction = useSelector(selectCurrentActions)

    const setCurrentActionFromExample = useCallback(() => {
        dispatch(
            setEntityActions(example as any)
        )
    }, [dispatch])

    const ActiveScreen = useCallback(() => {
        return <>
            <button onClick={() => setCurrentActionFromExample()}>
                Set example action
            </button>
            <h1 className={styles.roundHeader}>{t("local:game.round_n", {round: roundCount})}</h1>
            <h1 className={styles.roundHeader}>
                {t("local:game.control_info", {
                    name: activeEntityInfo?.name,

                })
                }
            </h1>
            <div id={"game-controller"} className={styles.gameControls}>
                <div id={"battle-info"} className={styles.battleInfo}>
                    <Battlefield/>
                    <GameStateFeed/>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <ActionInput/>
                    </div>
                </div>
            </div>
        </>
    }, [roundCount, activeEntityInfo, t, setCurrentActionFromExample])

    return (
        <>
            <h1>
                Debug Screen
            </h1>
            {
                ActiveScreen()
            }
        </>
    )
}

export default DebugScreen;