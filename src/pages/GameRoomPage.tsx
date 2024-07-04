import { useCallback, useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import GameLogicWrapper from '@components/GameLogicWrapper/GameLogicWrapper'
import Overlay from '@components/Overlay/Overlay'
import APIService from '@services/APIService'
import { useNavigate, useParams } from 'react-router-dom'

const GameRoomPage = () => {
    const { lobbyId } = useParams()
    const [loadingTranslations, setLoadingTranslations] = useState(true)
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const loadTranslations = useCallback(async () => {
        const translations = await APIService.getTranslations([i18n.language, 'uk-UA'], ['builtins', 'nyrzamaer'])
        for (const language in translations) {
            if (translations[language] === null) continue
            for (const dlc in translations[language]) {
                if (translations[language][dlc] === null) continue
                i18n.addResourceBundle(language, dlc, translations[language][dlc], true, true)
            }
        }
        if (lobbyId) {
            const customTranslations = await APIService.getCustomLobbyTranslations(lobbyId)
            i18n.addResourceBundle(i18n.language, "coordinator", customTranslations, true, true)
        }

    }, [i18n, lobbyId])

    useEffect(() => {
        try {
            setLoadingTranslations(true)
            loadTranslations().then(() => setLoadingTranslations(false))
        } catch (error) {
            console.log(error)
            navigate('..')
        }
    }, [i18n])

    return (
        <>
            {loadingTranslations ? (
                <Overlay>
                    <h1>{t('local:loading')}</h1>
                    <Spinner animation="border" role="status" />
                </Overlay>
            ) : (
                <GameLogicWrapper />
            )}
        </>
    )
}

export default GameRoomPage
