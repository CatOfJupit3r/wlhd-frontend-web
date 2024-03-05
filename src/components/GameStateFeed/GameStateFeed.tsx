import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardDoubleArrowRight
} from "react-icons/md";
import styles from "./GameStateFeed.module.css"
import {GameStateMessages} from "../../models/Battlefield";
import useLocalization from "../../hooks/useLocalization";

const GameStateFeed = (props: {
    messages: GameStateMessages;
}) => {

    const localize = useLocalization();
    const {t} = useTranslation();

    const [pages, setPages] = useState([] as Array<string>)
    const [messages, setMessages] = useState(props.messages);
    const [translatedMessages, setTranslatedMessages] = useState(Array<string>());
    const [currentPage, setCurrentPage] = useState(1);
    const [symbolsPerPage, ] = useState(400);

    useEffect(() => {
        setMessages(props.messages);
    }, [props.messages]);


    useEffect(() => {
        try {
            const memoryCells = Object.keys(messages).filter(
                (cell) => !translatedMessages.includes(cell)
            )
            if (memoryCells.length > 0) {
                let newPage = ""
                for (let address of memoryCells) {
                    const message = messages[address]
                    for (let cmd of message) {
                        newPage += localize(cmd) + "\n"
                    }
                }
                let choppedPages = ""
                while (newPage.length > symbolsPerPage) {
                    choppedPages += newPage.substring(0, symbolsPerPage) + "\n"
                    newPage = newPage.substring(symbolsPerPage)
                }
                setPages([...pages, ...choppedPages, newPage])
                setTranslatedMessages([...translatedMessages, ...memoryCells])
            }
        } catch (e) {
            console.log(e)
        }
    }, [messages, pages, translatedMessages, symbolsPerPage, localize]);

    const displayPage = useCallback((): JSX.Element => {
        return (
            <p style={{
                textWrap: "wrap",
                marginLeft: "10px",
                marginRight: "10px"
            }}>
                {pages[currentPage - 1]}
            </p>
        )
    }, [currentPage, pages])

    const handleNext = useCallback(() => {
        if (currentPage < pages.length) {
            setCurrentPage(currentPage + 1)
        } else {
            console.log("No more pages")
        }
    }, [currentPage, pages])

    const handlePrev = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        } else {
            console.log("No more pages")
        }
    }, [currentPage])

    const absoluteLeft = (key: string, filled: boolean, callback?: () => void) => {
        return (
            filled ?
                <MdOutlineKeyboardDoubleArrowLeft key={key} onClick={callback} className={styles.activeButton}/>
                :
                <MdOutlineKeyboardDoubleArrowLeft key={key} onClick={callback} className={styles.inactiveButton}/>
        )
    }

    const arrowLeft = (key: string, filled: boolean, callback?: () => void) => {
        return (
            filled ?
                <MdOutlineKeyboardArrowLeft key={key} onClick={callback} className={styles.activeButton}/>
                :
                <MdOutlineKeyboardArrowLeft key={key} onClick={callback} className={styles.inactiveButton}/>
        )
    }

    const absoluteRight = (key: string, filled: boolean, callback?: () => void) => {
        return (
            filled ?
                <MdOutlineKeyboardDoubleArrowRight key={key} onClick={callback} className={styles.activeButton}/>
                :
                <MdOutlineKeyboardDoubleArrowRight key={key} onClick={callback} className={styles.inactiveButton}/>
        )
    }

    const arrowRight = (key: string, filled: boolean, callback?: () => void) => {
        return (
            filled ?
                <MdOutlineKeyboardArrowRight key={key} onClick={callback} className={styles.activeButton}/>
                :
                <MdOutlineKeyboardArrowRight key={key} onClick={callback} className={styles.inactiveButton}/>
        )
    }

    return (
        <div className={styles.stateFeed} id={"game-state-feed"}>
            <div id={"title"} className={styles.title}>
                <h4>{t("local:game.components.battlefeed")}</h4>
            </div>
            <div className={styles.pageContainer}>
                {
                    displayPage()
                }
            </div>
            <div id={"page-manipulators"} className={styles.pageManipulators}>
                <div id={"left-arrows"}>
                    {
                        absoluteLeft("absolute-left", currentPage > 1, () => setCurrentPage(1))
                    }
                    {
                        currentPage > 1 ? arrowLeft("left", true, () => handlePrev()) : arrowLeft("left", false)
                    }
                </div>
                <div id={"right-arrows"}>
                {
                    currentPage < pages.length ? arrowRight("right", true, () => handleNext()) : arrowRight("right", false)
                }
                {
                    absoluteRight("absolute-right", currentPage < pages.length, () => setCurrentPage(pages.length))
                }
                </div>
            </div>
        </div>
    );
};

export default GameStateFeed;