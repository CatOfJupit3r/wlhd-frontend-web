import GameScreen from '@components/GameScreen/GameScreen'
import {
    resetGameScreenSlice,
    setActions,
    setBattlefield,
    setControlledEntities,
    setMessages,
    setRound,
    setTurnOrder,
    setYourTurn,
} from '@redux/slices/gameScreenSlice'
import { selectLobbyId } from '@redux/slices/lobbySlice'
import { AppDispatch } from '@redux/store'
import APIService from '@services/APIService'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import example_gamestate from '../data/example_gamestate.json'

const GameTestPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { i18n } = useTranslation()
    const [loadedGameState, setLoadedGameState] = useState(false)
    const lobbyId = useSelector(selectLobbyId)

    const dummySetActionOutput = useCallback(
        (output: any) => {
            console.log('DummySetActionOutput', output)
    }, [])

    useEffect(() => {
        dispatch(resetGameScreenSlice()) // to prevent any leftover state from previous games
    }, [])

    useEffect(() => {
        // dispatch(setBattlefield(example_gamestate.battlefield))
        dispatch(setRound(999))
        dispatch(setControlledEntities(example_gamestate.controlledEntities as any))
        dispatch(setTurnOrder(example_gamestate.turnOrder as any))
        dispatch(setMessages(example_gamestate.messages as any))
        dispatch(setActions(example_gamestate.actions as any))
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
