import GameScreen from '@components/GameScreen/GameScreen'
import { EntityInfoFull } from '@models/Battlefield'
import { IndividualTurnOrder } from '@models/GameHandshake'
import { setBattlefield } from '@redux/slices/battlefieldSlice'
import { setControlledEntities, setEntityTooltips, setMessages, setTurnOrder } from '@redux/slices/infoSlice'
import { selectLobbyId } from '@redux/slices/lobbySlice'
import { resetTurnSlice, setEntityActions, setPlayersTurn } from '@redux/slices/turnSlice'
import { AppDispatch } from '@redux/store'
import APIService from '@services/APIService'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import example_gamestate from '../data/example_gamestate.json'

const GameTestPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { i18n } = useTranslation()
    const [loadedGameState, setLoadedGameState] = useState(false)
    const lobbyId = useSelector(selectLobbyId)

    useEffect(() => {
        dispatch(resetTurnSlice()) // to prevent any leftover state from previous games
    }, [])

    useEffect(() => {
        dispatch(setEntityTooltips(example_gamestate.tooltips) as any)
        dispatch(setMessages(example_gamestate.messages as any))
        dispatch(setControlledEntities(example_gamestate.controlledEntities as EntityInfoFull[]))
        dispatch(setBattlefield(example_gamestate.battlefield as any))
        dispatch(setTurnOrder(example_gamestate.turnOrder as IndividualTurnOrder))
        dispatch(setEntityActions(example_gamestate.actions as any))
        dispatch(setPlayersTurn(true))
        const loadCustom = async () => {
            if (lobbyId) {
                const customTranslations = await APIService.getCustomLobbyTranslations(lobbyId)
                i18n.addResourceBundle(i18n.language, 'coordinator', customTranslations, true, true)
            }
        }
        loadCustom().then()
        setTimeout(() => setLoadedGameState(true), 1000)
    }, [])

    return <div>{loadedGameState ? <GameScreen /> : <div>Loading...</div>}</div>
}

export default GameTestPage
