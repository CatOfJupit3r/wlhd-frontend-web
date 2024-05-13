import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { resetTurnSlice, setEntityActions, setPlayersTurn } from '../redux/slices/turnSlice'
import GameScreen from '../components/GameScreen/GameScreen'
import { AppDispatch } from '../redux/store'
import { ActionInput } from '../models/ActionInput'
import { setBattlefield } from '../redux/slices/battlefieldSlice'
import { EntityInfoFull, EntityInfoTurn, GameStateContainer } from '../models/Battlefield'
import example_gamestate from '../data/example_gamestate.json'
import { setActiveEntity, setControlledEntities, setEntityTooltips, setMessages } from '../redux/slices/infoSlice'

const GameTestPage = () => {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(resetTurnSlice()) // to prevent any leftover state from previous games
    }, [dispatch])

    useEffect(() => {
        // dispatch(setEntityTooltips(example_gamestate.tooltips))
        // dispatch(setMessages(example_gamestate.messages as GameStateContainer))
        // dispatch(setControlledEntities(example_gamestate.controlledEntities as EntityInfoFull[]))
        // dispatch(setActiveEntity(example_gamestate.activeEntity as EntityInfoTurn))
        // dispatch(setBattlefield(example_gamestate.battlefield))
        // dispatch(setEntityActions(example_gamestate.actions as ActionInput))
        // dispatch(setPlayersTurn(true))
    }, [dispatch])

    return (
        <GameScreen />
    )
}

export default GameTestPage
