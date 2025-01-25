import GameScreen from '@components/GameScreen/GameScreen'
import useThisLobby from '@queries/useThisLobby'
import {
    resetGameScreenSlice,
    setActions,
    setActionTimestamp,
    setBattlefield,
    setControlledCharacters,
    setMessages,
    setRound,
    setTurnOrder,
    setYourTurn,
} from '@redux/slices/gameScreenSlice'
import { AppDispatch } from '@redux/store'
import APIService from '@services/APIService'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import example_gamestate from '../data/example_gamestate.json'

const GameTestPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { i18n } = useTranslation()
    const [loadedGameState, setLoadedGameState] = useState(false)
    const { lobbyId } = useThisLobby()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dummySetActionOutput = useCallback((output: any) => {
        console.log('DummySetActionOutput', output)
    }, [])

    useEffect(() => {
        dispatch(resetGameScreenSlice()) // to prevent any leftover state from previous games
    }, [])

    useEffect(() => {
        dispatch(setBattlefield(example_gamestate.battlefield))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setRound(example_gamestate.round.current as any))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setControlledCharacters(example_gamestate.controlledCharacters as any))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setTurnOrder(example_gamestate.round.order as any))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setMessages(example_gamestate.messages as any))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setActions(example_gamestate.actions as any))
        dispatch(setActionTimestamp(Date.now()))
        dispatch(setYourTurn(true))

        const loadCustom = async () => {
            if (lobbyId) {
                const customTranslations = await APIService.getCustomLobbyTranslations(lobbyId)
                i18n.addResourceBundle(i18n.language, 'coordinator', customTranslations, true, true)
            }
        }
        loadCustom().then()
        setTimeout(() => setLoadedGameState(true), 1000)
    }, [])

    return <div>{loadedGameState ? <GameScreen setActionOutput={dummySetActionOutput} /> : <div>Loading...</div>}</div>
}

export default GameTestPage
