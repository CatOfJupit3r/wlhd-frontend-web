import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import example from '../../data/example_action.json'
import example_messages from '../../data/example_messages.json'
import { TranslatableString } from '../../models/Battlefield'
import { addMessage, selectEntityInControlInfo, selectRound } from '../../redux/slices/infoSlice'
import { setNotify } from '../../redux/slices/notifySlice'
import { resetTurn, selectChoices, selectReadyToSubmit, setEntityActions } from '../../redux/slices/turnSlice'
import { AppDispatch } from '../../redux/store'
import ActionInput from '../ActionInput/ActionInput'
import Battlefield from '../Battlefield/Battlefield'
import GameStateFeed from '../GameStateFeed/GameStateFeed'
import styles from './DebugScreen.module.css'

const DebugScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation()

    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    const submittedInput = useSelector(selectChoices)
    const roundCount = useSelector(selectRound)
    const activeEntityInfo = useSelector(selectEntityInControlInfo)

    const setCurrentActionFromExample = useCallback(() => {
        dispatch(setEntityActions(example as any))
    }, [dispatch])

    const addRandomMessage = useCallback(() => {
        const randomMessages: { [key: string]: TranslatableString[] }[] = example_messages.data as any
        dispatch(addMessage(randomMessages[Math.floor(Math.random() * randomMessages.length)]))
    }, [dispatch])

    const ActiveScreen = useCallback(() => {
        return (
            <>
                <button onClick={() => setCurrentActionFromExample()}>Set example action</button>
                <button onClick={() => addRandomMessage()}>Add random message</button>
                <h1 className={styles.roundHeader}>{t('local:game.round_n', { round: roundCount })}</h1>
                <h1 className={styles.roundHeader}>
                    {t('local:game.control_info', {
                        name: activeEntityInfo?.name,
                        square: activeEntityInfo?.square,
                        current_ap: activeEntityInfo?.current_ap,
                        max_ap: activeEntityInfo?.max_ap,
                    })}
                </h1>
                <div id={'game-controller'} className={styles.gameControls}>
                    <div id={'battle-info'} className={styles.battleInfo}>
                        <Battlefield />
                        <GameStateFeed />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <ActionInput />
                        </div>
                    </div>
                </div>
            </>
        )
    }, [roundCount, activeEntityInfo, t, setCurrentActionFromExample])

    useEffect(() => {
        if (inputReadyToSubmit && submittedInput) {
            // socketEmitter("take_action", submittedInput)
            dispatch(
                setNotify({
                    message: JSON.stringify(submittedInput),
                    code: 200,
                })
            )
            dispatch(resetTurn())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch])

    return (
        <>
            <h1>Debug Screen</h1>
            {ActiveScreen()}
        </>
    )
}

export default DebugScreen
