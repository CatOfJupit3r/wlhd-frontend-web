import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

import {
    resetInfo,
    selectChoices,
    selectReadyToSubmit, setEntityActions,
} from "../../redux/slices/turnSlice";
import Battlefield from "../Battlefield/Battlefield";
import ActionInput from "../ActionInput/ActionInput";
import {setNotify} from "../../redux/slices/notifySlice";
import GameStateFeed from "../GameStateFeed/GameStateFeed";
import styles from "./DebugScreen.module.css";
import {
    selectEntityInControlInfo,
    selectRound
} from "../../redux/slices/infoSlice";
import {AppDispatch} from "../../redux/store";
import example from "../../data/example_action.json"


const DebugScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation()

    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    const submittedInput = useSelector(selectChoices)
    const roundCount = useSelector(selectRound)
    const activeEntityInfo = useSelector(selectEntityInControlInfo)

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

    useEffect(() => {
        if (inputReadyToSubmit && submittedInput) {
            // socketEmitter("take_action", submittedInput)
            dispatch(setNotify({
                message: JSON.stringify(submittedInput),
                code: 200
            }))
            dispatch(resetInfo())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch]);

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