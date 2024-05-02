import {useCallback, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'

import {resetGameComponentsStateAction} from '../../redux/highActions'
import {selectActiveEntity, selectGameFlow, selectRound} from '../../redux/slices/infoSlice'
import {selectLobbyInfo} from '../../redux/slices/lobbySlice'
import {setNotify} from '../../redux/slices/notifySlice'
import {
    resetHighlightedComponents,
    resetTurnSlice,
    selectChoices,
    selectReadyToSubmit,
} from '../../redux/slices/turnSlice'
import {AppDispatch} from '../../redux/store'
import SocketService from '../../services/SocketService'
import Battlefield from '../Battlefield/Battlefield'
import Overlay from '../Overlay/Overlay'
import ThinkingHn from '../ThinkingHn'
import MenuContainer from "../MenuContainer/MenuContainer";
import MenuNavigator from "../MenuNavigator/MenuNavigator";
import RoundHeader from "./RoundHeader";

const HALF_SCREEN_STYLE = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
}

const GameScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { gameId, lobbyId } = useParams()

    const activeEntityInfo = useSelector(selectActiveEntity)
    const gameFlow = useSelector(selectGameFlow)
    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    const submittedInput = useSelector(selectChoices)
    const roundCount = useSelector(selectRound)
    const lobbyInfo = useSelector(selectLobbyInfo)

    useEffect(() => {
        if (!lobbyId || !gameId) {
            // if (somehow) lobbyId or gameId is not set, we leave the page before anything bad happens
            dispatch(resetTurnSlice())
            navigate('..')
            return
        }
        document.title =
            t('local:game.title', { gameId: gameId }) === t('local:game.title')
                ? 'Game'
                : t('local:game.title', { gameId: gameId })
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
            dispatch(resetTurnSlice())
            SocketService.emit('take_action', submittedInput)
        }
    }, [inputReadyToSubmit, submittedInput, dispatch])

    const ActiveScreen = useCallback(() => {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <div
                    style={{
                        ...HALF_SCREEN_STYLE,
                        width: '60%',
                        backgroundColor: 'black',
                        color: 'white',
                        flexDirection: 'column',
                    }}
                >
                    <RoundHeader />
                    <Battlefield mode={'game'} />
                </div>
                <div
                    style={{
                        ...HALF_SCREEN_STYLE,
                        width: '40%',
                        flexDirection: 'row',
                        backgroundColor: 'white',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            height: '100%',
                            width: '90%',
                            minWidth: 'fit-content',
                            justifyContent: 'center',
                            padding: '2vh',
                        }}
                    >
                        <MenuContainer />
                    </div>
                    <div
                        style={{
                            backgroundColor: 'black',
                            height: '100%',
                            width: '10%',
                            minWidth: 'fit-content',
                        }}
                    >
                        <MenuNavigator />
                    </div>
                </div>
            </div>
        )
    }, [roundCount, activeEntityInfo, t])

    const getCurrentScreen = useCallback((): JSX.Element => {
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
