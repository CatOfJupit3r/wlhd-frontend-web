import React from 'react';
import NicknameEnter from '../components/NicknameEnter';
import {useTranslation} from "react-i18next";


function HomePage() {
    const { t } = useTranslation();
    return (
        <div>
            <h1>{t("local:home_page")}</h1>
            <NicknameEnter/>
        </div>
    );
}

export default HomePage;
