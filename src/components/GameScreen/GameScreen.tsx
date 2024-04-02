import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

import { Spinner } from 'react-bootstrap'
import { REACT_APP_BACKEND_URL } from '../../config/configs'
import {
    ActionResultsPayload,
    BattleEndedPayload,
    NewMessagePayload,
    RoundUpdatePayload,
    TakeActionPayload,
} from '../../models/Events'
import { selectGameId, selectIsActive, selectName, setActive } from '../../redux/slices/gameSlice'
import {
    fetchAllEntitiesInfo,
    fetchAllMessages,
    fetchBattlefield,
    fetchTheMessage,
    selectEndInfo,
    selectEntityInControlInfo,
    selectRound,
    setEndInfo,
    setRound,
} from '../../redux/slices/infoSlice'
import { setNotify } from '../../redux/slices/notifySlice'
import {
    fetchActions,
    resetInfo,
    selectChoices,
    selectIsLoadingEntityActions,
    selectReadyToSubmit,
    setPlayersTurn,
} from '../../redux/slices/turnSlice'
import { AppDispatch } from '../../redux/store'
import ActionInput from '../ActionInput/ActionInput'
import Battlefield from '../Battlefield/Battlefield'
import GameStateFeed from '../GameStateFeed/GameStateFeed'
import Overlay from '../Overlay/Overlay'
import styles from './GameScreen.module.css'

const GameScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const username = useSelector(selectName)
    const isActive = useSelector(selectIsActive)
    const gameId = useSelector(selectGameId)
    const isLoadingActions = useSelector(selectIsLoadingEntityActions)
    const activeEntityInfo = useSelector(selectEntityInControlInfo)
    const endInfo = useSelector(selectEndInfo)
    const inputReadyToSubmit = useSelector(selectReadyToSubmit)
    const submittedInput = useSelector(selectChoices)
    const roundCount = useSelector(selectRound)

    let retries: number = useMemo(() => 3, [])

    const socketRef = useRef<Socket | null>(null)

    const socketEmitter = useCallback(
        (
            event: string,
            payload:
                | {
                      [key: string]: string
                  }
                | undefined = undefined
        ) => {
            if (!socketRef.current) {
                return
            }
            try {
                socketRef.current?.emit(event, payload)
            } catch (e) {
                console.log('Error occurred during emitting of socket: ', e)
            }
        },
        []
    )

    useEffect(() => {
        if (!username || !gameId) {
            // If the user is not logged in or the game has not started, we redirect to the main page
            setTimeout(() => {
                dispatch(resetInfo())
                navigate('..')
            }, 200)
        }
        document.title =
            t('local:game.title', { gameId: gameId }) === t('local:game.title')
                ? 'Game'
                : t('local:game.title', { gameId: gameId })
        if (socketRef.current) {
            // If the socket is already connected, we don't need to connect again
            return
        }
        const socket = io(REACT_APP_BACKEND_URL, {
            reconnection: false,
            query: {
                game_id: gameId,
                user_token: username,
            },
        })
        socketRef.current = socket
        socket.on('connect_error', () => {
            dispatch(setNotify({ message: t('local:error'), code: 500 }))
            setTimeout(() => {
                navigate('..')
            }, 200)
        })
        socket.on('connect', () => {
            console.log('Connected to game server')
        })
        socket.on('close', () => {
            console.log('Disconnected from game server')
        })
        socket.on('take_action', (data: TakeActionPayload) => {
            dispatch(fetchBattlefield(gameId))
            dispatch(fetchAllEntitiesInfo(gameId))
            dispatch(
                fetchActions({
                    game_id: gameId,
                    entity_id: (data as any).entity_id,
                })
            )
                .then(() => {
                    dispatch(setPlayersTurn(true))
                })
                .catch((e) => {
                    console.log('Error occurred during fetching of actions: ', e)
                    socketEmitter('unable_to_take_action')
                })
        })
        socket.on('battle_started', () => {
            (async () => {
                await dispatch(fetchBattlefield(gameId))
                await dispatch(fetchAllMessages(gameId))
                await dispatch(fetchAllEntitiesInfo(gameId))
            })().finally(() => {
                dispatch(setActive(true))
            })
        })
        socket.on('round_update', (data: RoundUpdatePayload) => {
            dispatch(setRound({ round: data.round_number ? data.round_number : '1' }))
        })
        socket.on('new_message', (data: NewMessagePayload) => {
            dispatch(fetchTheMessage({ game_id: gameId, message: data.message }))
            dispatch(fetchAllEntitiesInfo(gameId))
        })
        socket.on('battlefield_updated', () => {
            dispatch(fetchBattlefield(gameId))
            dispatch(fetchAllEntitiesInfo(gameId))
        })
        socket.on('choices_timeout', () => {
            dispatch(
                setNotify({
                    message: t('local:game.actions.timeout'),
                    code: 500,
                })
            )
            dispatch(resetInfo())
        })
        socket.on('action_result', (data: ActionResultsPayload) => {
            try {
                dispatch(
                    setNotify({
                        message: data.code === 200 ? t('local:success') : t('local:error'),
                        code: data.code,
                    })
                )
            } catch (e) {
                console.log('Error occurred during handling of socket: ', e)
            }
        })
        socket.on('battle_ended', (data: BattleEndedPayload) => {
            console.log('Game has ended')
            dispatch(setEndInfo({ ended: true, winner: data.battle_result }))
            dispatch(setActive(false))
            socket.disconnect()
        })
        socket.on('error', (data: any) => {
            console.log('Error occurred during handling of socket: ', data)
        })
        socket.on('disconnect', () => {
            console.log('Disconnected from game server')
            if (retries > 0) {
                console.log('Reconnecting...')
                retries--
                socket.connect()
            } else {
                console.log('Could not reconnect to game server')
                setTimeout(() => {
                    navigate('..')
                }, 200)
            }
        })
    }, [username, gameId, dispatch, t, navigate, retries, socketEmitter])

    useEffect(() => {
        if (inputReadyToSubmit && submittedInput) {
            socketEmitter('take_action', submittedInput)
            dispatch(
                setNotify({
                    message: JSON.stringify(submittedInput),
                    code: 200,
                })
            )
            dispatch(resetInfo())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch, socketEmitter])

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

    useEffect(() => {
        if (inputReadyToSubmit && submittedInput) {
            // socketEmitter("take_action", submittedInput)
            dispatch(
                setNotify({
                    message: JSON.stringify(submittedInput),
                    code: 200,
                })
            )
            dispatch(resetInfo())
        }
    }, [inputReadyToSubmit, submittedInput, dispatch])

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
