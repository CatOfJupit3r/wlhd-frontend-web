import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import GameLogicWrapper from '../components/GameLogicWrapper/GameLogicWrapper'
import Overlay from '../components/Overlay/Overlay'
import APIService from '../services/APIService'
import { log } from 'node:util'

const GameRoomPage = () => {
    const [loadingTranslations, setLoadingTranslations] = useState(true)
    const { t, i18n } = useTranslation()

    useEffect(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;['builtins'].map((dlc) => {
                const addTranslations = async (language: string) => {
                    const translations = await APIService.getTranslations(language, dlc)
                    console.log("Received translations: ", translations)
                    if (!translations) return
                    i18n.addResourceBundle(i18n.language, dlc, translations, true, true)
                }
                return [i18n.language, 'ua-UK'].map((language) => {
                    addTranslations(language).then(() => setLoadingTranslations(false)) // ONLY LET THE USER SEE THE GAME WHEN ALL TRANSLATIONS ARE LOADED
                    return null
                })
            })
        } catch (e) {
            console.log(e)
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
