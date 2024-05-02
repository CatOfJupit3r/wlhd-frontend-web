import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import GameScreen from '../components/GameScreen/GameScreen'
import Overlay from '../components/Overlay/Overlay'
import APIService from '../services/APIService'
import { AppDispatch } from '../redux/store'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../redux/slices/cosmeticsSlice'

const GameRoomPage = () => {
    const [loadingTranslations, setLoadingTranslations] = useState(true)
    const { t, i18n } = useTranslation()

    useEffect(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;['builtins', 'nyrzamaer'].map((dlc) => {
                const addTranslations = async (language: string) => {
                    const translations = await APIService.getTranslations(language, dlc)
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
                <GameScreen />
            )}
        </>
    )
}

export default GameRoomPage
