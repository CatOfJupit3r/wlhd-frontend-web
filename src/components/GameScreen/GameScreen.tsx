import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { resetGameComponentsStateAction } from '../../redux/highActions'
import { selectActiveEntity, selectGameFlow, selectRound } from '../../redux/slices/infoSlice'
import { setNotify } from '../../redux/slices/notifySlice'
import {
    resetHighlightedComponents,
    resetTurnSlice,
    selectChoices,
    selectIsLoadingEntityActions,
    selectReadyToSubmit,
} from '../../redux/slices/turnSlice'
import { AppDispatch } from '../../redux/store'
import SocketService from '../../services/SocketService'
import ActionInput from '../ActionInput/ActionInput'
import Battlefield from '../Battlefield/Battlefield'
import GameMessagesFeed from '../GameMessagesFeed/GameMessagesFeed'
import Overlay from '../Overlay/Overlay'
import ThinkingHn from '../ThinkingHn'
import styles from './GameScreen.module.css'

const GameScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { gameId, lobbyId } = useParams()

    const isLoadingActions = useSelector(selectIsLoadingEntityActions)
    const activeEntityInfo = useSelector(selectActiveEntity)
    const gameFlow = useSelector(selectGameFlow)
    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    const submittedInput = useSelector(selectChoices)
    const roundCount = useSelector(selectRound)

    useEffect(() => {
        if (!lobbyId || !gameId) { // if (somehow) lobbyId or gameId is not set, we leave the page before anything bad happens
            dispatch(resetTurnSlice())
            navigate('..')
            return
        }
        document.title =
            t('local:game.title', { gameId: gameId }) === t('local:game.title')
                ? 'Game'
                : t('local:game.title', { gameId: gameId })
        console.log('GameScreen: useEffect: gameId', gameId)
        dispatch(resetGameComponentsStateAction())
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
            dispatch(resetTurnSlice())
            dispatch(resetHighlightedComponents())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch])

    const ActiveScreen = useCallback(() => {
        return (
            <>
                <h1 className={styles.roundHeader}>{t('local:game.round_n', { round: roundCount })}</h1>
                <h1 className={styles.roundHeader}>
                    {activeEntityInfo
                        ? t('local:game.control_info', {
                              name: activeEntityInfo.name,
                          })
                        : t('local:game.control_info_no_entity')}
                </h1>
                <div id={'game-controller'} className={styles.gameControls}>
                    <div id={'battle-info'} className={styles.battleInfo}>
                        <Battlefield />
                        <GameMessagesFeed />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {isLoadingActions ? (
                                <Overlay>
                                    <ThinkingHn text={t('local:game.actions.loading')} />
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

    const getCurrentScreen = useCallback((): JSX.Element => {
        switch (gameFlow?.type) {
            case 'pending':
                return (
                    <Overlay>
                        <ThinkingHn text={t('local:game.pending.not_started')} />
                        <h2>{t(gameFlow.details || 'local:game.pending.waiting_text')}</h2>
                    </Overlay>
                )
            case 'active':
                return ActiveScreen()
            case 'ended':
                return (
                    <Overlay row={false}>
                        <h1>{t('local:game.end.title')}</h1>
                        <h1>
                            {t('local:game.end.result', {
                                result: t(gameFlow.details) || t('local:game.end.no_winner_received'),
                            })}
                        </h1>
                        <button
                            onClick={() => {
                                navigate('..')
                            }}
                        >
                            {t('local:game.end.exit')}
                        </button>
                    </Overlay>
                )
            case 'aborted':
                return (
                    <Overlay>
                        <h1>{t('local:game.end.aborted')}</h1>
                        <h2>{t(gameFlow.details || 'local:game.end.aborted_text')}</h2>
                        <button
                            onClick={() => {
                                navigate('..')
                            }}
                        >
                            {t('local:game.end.exit')}
                        </button>
                    </Overlay>
                )
            default:
                return (
                    <Overlay>
                        <ThinkingHn text={t('local:game.pending.not_started')} />
                    </Overlay>
                )
        }
    }, [gameFlow, navigate, t])

    return getCurrentScreen()
}

export default GameScreen
