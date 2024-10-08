import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import GameScreen from '@components/GameScreen/GameScreen'
import Overlay from '@components/Overlay'
import ThinkingHn from '@components/ThinkingHn'
import { Button } from '@components/ui/button'
import { ActionContextType } from '@context/ActionContext'
import { useToast } from '@hooks/useToast'
import { resetGameScreenSlice, selectGameFlow, setActions } from '@redux/slices/gameScreenSlice'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { AppDispatch } from '@redux/store'
import paths from '@router/paths'
import SocketService from '@services/SocketService'

const GameLogicWrapper = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [actionOutput, setActionOutput] = useState<ActionContextType['choices']['mechanic'] | null>(null)
    const { t } = useTranslation()
    const { toast } = useToast()
    const navigate = useNavigate()

    const { gameId, lobbyId } = useParams()

    const gameFlow = useSelector(selectGameFlow)
    const lobbyInfo = useSelector(selectLobbyInfo)

    useEffect(() => {
        if (!lobbyId || !gameId) {
            // if (somehow) lobbyId or gameId is not set, we leave the page before anything bad happens
            dispatch(resetGameScreenSlice())
            navigate('..')
            return
        }
        dispatch(setActions(null))
        SocketService.connect({
            lobbyId,
            combatId: gameId,
        })
    }, [gameId, dispatch, t, navigate])

    useEffect(() => {
        if (actionOutput) {
            toast({
                title: t('local:game.action_output'),
                description: JSON.stringify(actionOutput),
                position: 'bottom-left',
            })
            dispatch(setActions(null))
            SocketService.emit('take_action', actionOutput)
        }
    }, [actionOutput, dispatch])

    const navigateToLobby = useCallback(() => {
        if (!lobbyId) {
            return
        }
        navigate(paths.lobbyRoom.replace(':lobbyId', lobbyId))
    }, [lobbyId, navigate])

    const CurrentScreen = useCallback((): JSX.Element => {
        switch (gameFlow?.type) {
            case 'pending':
                return (
                    <Overlay>
                        <div className={'flex flex-col items-center justify-center gap-4'}>
                            <ThinkingHn text={t('local:game.pending.not_started')} />
                            <h2>{t(gameFlow.details || 'local:game.pending.waiting_text')}</h2>
                            {lobbyInfo.layout === 'gm' ? (
                                <Button
                                    onClick={() => {
                                        SocketService.emit('start_combat')
                                    }}
                                >
                                    {t('local:game.pending.start')}
                                </Button>
                            ) : null}
                            <Button onClick={navigateToLobby}>{t('local:game.pending.exit')}</Button>
                        </div>
                    </Overlay>
                )
            case 'active':
                return (
                    <GameScreen
                        setActionOutput={(output) => {
                            setActionOutput(output)
                        }}
                    />
                )
            case 'ended':
                return (
                    <Overlay>
                        <div className={'flex flex-col items-center justify-center gap-4'}>
                            <h1>{t('local:game.end.title')}</h1>
                            <h1>
                                {t('local:game.end.result', {
                                    result: t(gameFlow.details) || t('local:game.end.no_winner_received'),
                                })}
                            </h1>
                            <Button onClick={navigateToLobby}>{t('local:game.end.exit')}</Button>
                        </div>
                    </Overlay>
                )
            case 'aborted':
                return (
                    <Overlay>
                        <div className={'flex flex-row items-center justify-center gap-4'}>
                            <h1>{t('local:game.end.aborted')}</h1>
                            <h2>{t(gameFlow.details || 'local:game.end.aborted_text')}</h2>
                            <Button onClick={navigateToLobby}>{t('local:game.end.exit')}</Button>
                        </div>
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
