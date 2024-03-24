import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import DebugScreen from '../components/DebugScreen/DebugScreen'
import Overlay from '../components/Overlay/Overlay'
import { getTranslations } from '../services/apiServices'

const DebugRoomPage = () => {
    const [loadingTranslations, setLoadingTranslations] = useState(true)
    const { t, i18n } = useTranslation()
    // const navigate = useNavigate()
    // const nickName =  useSelector(selectName)
    // const gameId = useSelector(selectGameId)
    //
    //
    // if (!nickName || !gameId) {
    //     navigate('..')
    // }
    //
    useEffect(() => {
        try {
            ['builtins', 'nyrzamaer'].map((dlc) => {
                const addTranslations = async (language: string) => {
                    await getTranslations(language, dlc)
                        .then((translations) => {
                            if (!translations) {
                                return
                            }
                            i18n.addResourceBundle(i18n.language, dlc, translations, true, true)
                        })
                        .catch((e) => console.log(e))
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
                <DebugScreen />
            )}
        </>
    )
}

export default DebugRoomPage
