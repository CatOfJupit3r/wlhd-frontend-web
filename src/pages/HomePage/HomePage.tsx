import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import UserInfoEnter from "../../components/UserInfoEnter/UserInfoEnter";
import styles from "./HomePage.module.css";
import {useDispatch} from "react-redux";
import {resetInfo} from "../../redux/slices/turnSlice";

function HomePage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetInfo())
    }, []);

    return (
        <>
        <div className={styles.title} id={"title"}>
            <h1>{t("local:index.title")}</h1>
            <h2>{t("local:index.subtitle")}</h2>
        </div>
        <div className={`poppins ${styles.joinContainer}`} id={"join-game"}>
            <h1>
                {t("local:index.join.title")}
            </h1>
            <UserInfoEnter/>
        </div>
        </>
    );
}

export default HomePage;
