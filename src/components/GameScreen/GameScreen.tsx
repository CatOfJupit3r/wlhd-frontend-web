import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { Spinner } from 'react-bootstrap'
import { selectEndInfo, selectEntityInControlInfo, selectRound } from '../../redux/slices/infoSlice'
import { setNotify } from '../../redux/slices/notifySlice'
import {
    resetHighlightedComponents,
    resetInfo,
    selectChoices,
    selectIsLoadingEntityActions,
    selectReadyToSubmit,
} from '../../redux/slices/turnSlice'
import { AppDispatch } from '../../redux/store'
import SocketService from '../../services/SocketService'
import ActionInput from '../ActionInput/ActionInput'
import Battlefield from '../Battlefield/Battlefield'
import GameStateFeed from '../GameStateFeed/GameStateFeed'
import Overlay from '../Overlay/Overlay'
import styles from './GameScreen.module.css'

const GameScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const isActive = true
    const { gameId, lobbyId } = useParams()

    const isLoadingActions = useSelector(selectIsLoadingEntityActions)
    const activeEntityInfo = useSelector(selectEntityInControlInfo)
    const endInfo = useSelector(selectEndInfo)
    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    const submittedInput = useSelector(selectChoices)
    const roundCount = useSelector(selectRound)

    useEffect(() => {
        if (!lobbyId || !gameId) {
            dispatch(resetInfo())
            navigate('..')
            return
        }
        document.title =
            t('local:game.title', { gameId: gameId }) === t('local:game.title')
                ? 'Game'
                : t('local:game.title', { gameId: gameId })
        SocketService.connect({
            lobbyId,
            combatId: gameId,
        })
    }, [gameId, dispatch, t, navigate])

    useEffect(() => {
        if (inputReadyToSubmit && submittedInput) {
            dispatch(
                setNotify({
                    message: JSON.stringify(submittedInput),
                    code: 200,
                })
            )
            SocketService.emit('take_action', submittedInput)
            dispatch(resetInfo())
            dispatch(resetHighlightedComponents())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch])

    const ActiveScreen = useCallback(() => {
        return (
            <>
                <h1 className={styles.roundHeader}>{t('local:game.round_n', { round: roundCount })}</h1>
                <h1 className={styles.roundHeader}>
                    {t('local:game.control_info', {
                        name: activeEntityInfo?.name,
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
                            {isLoadingActions ? (
                                <Overlay>
                                    <h1>{t('local:game.actions.loading')}</h1>
                                    <Spinner role="status" />
                                </Overlay>
                            ) : (
                                <ActionInput />
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    }, [roundCount, activeEntityInfo, t, isLoadingActions])

    return endInfo && endInfo.ended ? ( // if the game has ended, we show the end screen
        <Overlay row={false}>
            <h1>{t('local:game.end.title')}</h1>
            <h1>{t('local:game.end.result', { result: endInfo.winner })}</h1>
            <button
                onClick={() => {
                    navigate('..')
                }}
            >
                {t('local:game.end.exit')}
            </button>
        </Overlay>
    ) : // if the game has not ended, we show the game screen
    isActive ? ( // if the game has started, we show the game screen
        ActiveScreen() // if the game has started, we show the game screen
    ) : (
        // if the game has not started, we show the loading screen
        <Overlay>
            <h1>{t('local:game.pending.not_started')}</h1>
            <Spinner animation="grow" role="status" />
        </Overlay>
    )
}

export default GameScreen
