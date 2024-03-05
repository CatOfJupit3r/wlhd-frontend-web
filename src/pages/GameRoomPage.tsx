import React, {useEffect, useState} from 'react';
import {getTranslations} from "../services/apiServices";
import {useTranslation} from "react-i18next";
import GameScreen from "../components/GameScreen/GameScreen";
import {useSelector} from "react-redux";
import {selectGameId, selectName} from "../redux/slices/gameSlice";
import {useNavigate} from "react-router-dom";


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
    const {i18n} = useTranslation()
    const navigate = useNavigate()
    const nickName =  useSelector(selectName)
    const gameId = useSelector(selectGameId)


    if (!nickName || !gameId) {
        navigate('..')
    }

    useEffect(() => {
        console.log("Loading translations")
        try {
            ["builtins", "nyrzamaer"].map((dlc) => {
                const addTranslations = (language: string) => {
                    getTranslations(language, dlc)
                        .then((translations) => {
                            if (!translations) {
                            }
                            console.log(translations)
                            i18n.addResourceBundle(i18n.language, dlc, translations, true, true);
                        })
                        .catch((e) => console.error(e))
                }
                return [i18n.language, "ua-UK"].map((language) => addTranslations(language))
            })
        } catch (e) {
            console.error(e)
        }
        console.log()
        console.log("Translations loaded")
        setLoadingTranslations(false)
    }, [i18n]);

    return (
        <>
            {
                loadingTranslations ?
                    <h1>Loading...</h1>
                    :
                    <GameScreen />
            }
        </>
    )
};

export default GameRoomPage;