import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { resetGameComponentsStateAction } from '@redux/highActions'
import { setNotify } from '@redux/slices/cosmeticsSlice'
import { selectGameFlow } from '@redux/slices/infoSlice'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { resetTurnSlice, selectOutput } from '@redux/slices/turnSlice'
import { AppDispatch } from '@redux/store'
import SocketService from '@services/SocketService'
import GameScreen from '../GameScreen/GameScreen'
import Overlay from '../Overlay/Overlay'
import ThinkingHn from '../ThinkingHn/ThinkingHn'

const GameLogicWrapper = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { gameId, lobbyId } = useParams()

    const gameFlow = useSelector(selectGameFlow)
    const actionOutput = useSelector(selectOutput)
    const lobbyInfo = useSelector(selectLobbyInfo)

    useEffect(() => {
        if (!lobbyId || !gameId) {
            // if (somehow) lobbyId or gameId is not set, we leave the page before anything bad happens
            dispatch(resetTurnSlice())
            navigate('..')
            return
        }
        dispatch(resetGameComponentsStateAction())
        SocketService.connect({
            lobbyId,
            combatId: gameId,
        })
    }, [gameId, dispatch, t, navigate])

    useEffect(() => {
        if (actionOutput) {
            dispatch(
                setNotify({
                    message: JSON.stringify(actionOutput),
                    code: 200,
                })
            )
            dispatch(resetTurnSlice())
            SocketService.emit('take_action', actionOutput)
        }
    }, [actionOutput, dispatch])

    const CurrentScreen = useCallback((): JSX.Element => {
        switch (gameFlow?.type) {
            case 'pending':
                return (
                    <Overlay>
                        <ThinkingHn text={t('local:game.pending.not_started')} />
                        <h2>{t(gameFlow.details || 'local:game.pending.waiting_text')}</h2>
                        {lobbyInfo.layout === 'gm' ? (
                            <button
                                onClick={() => {
                                    SocketService.emit('start_combat')
                                }}
                            >
                                {t('local:game.pending.start')}
                            </button>
                        ) : null}
                        <button onClick={() => navigate('..')}>{t('local:game.pending.exit')}</button>
                    </Overlay>
                )
            case 'active':
                return <GameScreen />
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

    return <CurrentScreen />
}

export default GameLogicWrapper
