import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useBeforeUnload, useNavigate } from 'react-router-dom'
import GameScreen from '../components/GameScreen/GameScreen'
import Overlay from '../components/Overlay/Overlay'
import { selectGameId, selectName } from '../redux/slices/gameSlice'
import { resetInfo } from '../redux/slices/turnSlice'
import { getTranslations } from '../services/apiServices'

/*

The Game Room Page is the page where the game is played. It is the main page of the game and

When game haven't started, it will only show text "Waiting for server to start_game"
After this, socket will listen for commands from server:
    - start_game = web shows the game board and prepare the page for game
    - take_action = web gives user option to take action from given (for now, it will be in the form of select box)
    - end_game = displays game result and after 15 seconds return to root of site

 */

const GameRoomPage = () => {
    const [loadingTranslations, setLoadingTranslations] = useState(true)
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const nickName = useSelector(selectName)
    const gameId = useSelector(selectGameId)

    if (!nickName || !gameId) {
        navigate('..')
    }

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

    useBeforeUnload(
        React.useCallback(() => {
            dispatch(resetInfo())
        }, [dispatch])
    )

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
