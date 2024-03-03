import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectGameId, selectName, setGameId as setGameIDStore, setName as setNicknameStore} from "../../redux/slices/gameSlice";
import {useTranslation} from "react-i18next";
import styles from './UserInfoEnter.module.css';

const UserInfoEnter: React.FC = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [gameID, setGameID] = useState(useSelector(selectGameId))
    const [nickname, setNickname] = useState(useSelector(selectName));

    const inputValid = useCallback((input: string) => {
        return input === "" || (input && input.length > 3);
    }, []);

    const handleNickname = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    }, []);

    const handleGameId = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setGameID(e.target.value);
    }, []);

    useEffect(() => {
        if (inputValid(nickname)) {
            dispatch(setNicknameStore(nickname));
        }
    }, [nickname, dispatch, inputValid]);

    useEffect(() => {
        if (inputValid(gameID)) {
            dispatch(setGameIDStore(gameID));
        }
    }, [gameID, dispatch, inputValid]);

    return (
        <div className={styles.inputsContainer}>
            <input
                type="text"
                value={nickname}
                onChange={(e) => handleNickname(e)}
                placeholder={t("local:index.join.us-input")}
                className={styles.inputField}
            />
            <input
                type="text"
                value={gameID}
                onChange={(e) => handleGameId(e)}
                placeholder={t("local:index.join.gi-input")}
                className={styles.inputField}
            />
            <button disabled={!(nickname && nickname.length > 3) || !(gameID && gameID.length > 3)}>
                {t("local:index.join.submit")}
            </button>
        </div>
    );
};


export default UserInfoEnter;