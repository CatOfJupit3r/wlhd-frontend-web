import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import GameScreen from '../components/GameScreen/GameScreen'
import example_gamestate from '../data/example_gamestate.json'
import { EntityInfoFull } from '../models/Battlefield'
import { setBattlefield } from '../redux/slices/battlefieldSlice'
import { setActiveEntity, setControlledEntities, setEntityTooltips, setMessages } from '../redux/slices/infoSlice'
import { resetTurnSlice, setEntityActions, setPlayersTurn } from '../redux/slices/turnSlice'
import { AppDispatch } from '../redux/store'
import APIService from '../services/APIService'

const GameTestPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { i18n } = useTranslation()

    const loadTranslations = useCallback(async () => {
        const translations = await APIService.getTranslations([i18n.language, 'uk-UA'], ['builtins', 'nyrzamaer'])
        if (!translations) throw new Error('Failed to load translations. Server response was empty.')
        console.log('translations', translations)
        for (const language in translations) {
            if (translations[language] === null) continue
            for (const dlc in translations[language]) {
                if (translations[language][dlc] === null) continue
                i18n.addResourceBundle(language, dlc, translations[language][dlc], true, true)
            }
        }
    }, [i18n])

    useEffect(() => {
        dispatch(resetTurnSlice()) // to prevent any leftover state from previous games
        loadTranslations().then(() => console.log('translations loaded')).catch((error) => console.log(error))
    }, [dispatch])

    useEffect(() => {
        dispatch(setEntityTooltips(example_gamestate.tooltips) as any)
        dispatch(setMessages(example_gamestate.messages as any))
        dispatch(setControlledEntities(example_gamestate.controlledEntities as EntityInfoFull[]))
        dispatch(setActiveEntity(example_gamestate.activeEntity as any))
        dispatch(setBattlefield(example_gamestate.battlefield as any))
        dispatch(setEntityActions(example_gamestate.actions as any))
        dispatch(setPlayersTurn(true))
    }, [dispatch])

    return <GameScreen />
}

export default GameTestPage
