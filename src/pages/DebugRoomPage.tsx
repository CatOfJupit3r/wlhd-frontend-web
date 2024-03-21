import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectGameId, selectName} from "../redux/slices/gameSlice";
import {getTranslations} from "../services/apiServices";
import Overlay from "../components/Overlay/Overlay";
import {Spinner} from "react-bootstrap";
import GameScreen from "../components/GameScreen/GameScreen";
import DebugScreen from "../components/DebugScreen/DebugScreen";

const DebugRoomPage = () => {
    const [loadingTranslations, setLoadingTranslations] = useState(true)
    const {t, i18n} = useTranslation()
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
            ["builtins", "nyrzamaer"].map((dlc) => {
                const addTranslations = async (language: string) => {
                    await getTranslations(language, dlc)
                        .then((translations) => {
                            if (!translations) {
                            }
                            i18n.addResourceBundle(i18n.language, dlc, translations, true, true);
                        })
                        .catch((e) => console.log(e))
                }
                return [i18n.language, "ua-UK"].map((language) => {
                    addTranslations(language)
                        .then(() => setLoadingTranslations(false)) // ONLY LET THE USER SEE THE GAME WHEN ALL TRANSLATIONS ARE LOADED
                    return null
                })
            })
        } catch (e) {
            console.log(e)
        }
    }, [i18n]);

    return (
        <>
            {
                loadingTranslations ?
                    <Overlay>
                         <h1>{t("local:loading")}</h1>
                         <Spinner animation="border" role="status" />
                    </Overlay>
                    :
                    <DebugScreen />
            }
        </>
    )
};

export default DebugRoomPage;