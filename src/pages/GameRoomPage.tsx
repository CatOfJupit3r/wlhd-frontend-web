import React, {useEffect, useState} from 'react';
import {getTranslations} from "../services/apiServices";
import {useTranslation} from "react-i18next";
import GameScreen from "../components/GameScreen/GameScreen";


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

    useEffect(() => {
        try {
            ["builtins", "nyrzamaer"].map((dlc) => (
                getTranslations(i18n.language, dlc)
                    .then((translations) => {
                        i18n.addResourceBundle(i18n.language, dlc, translations, true, true);
                    })
            ))
        } catch (e) {
            console.error(e)
        }
        console.log(i18n.store.data)
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