import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {cmdToFormatted, cmdToTranslation} from "../../utils/cmdConverters";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardDoubleArrowRight
} from "react-icons/md";
import styles from "./GameStateFeed.module.css"

const GameStateFeed = (props: {
    messages: { [key: string]: Array<[string, string[]]> };
}) => {

    const {t} = useTranslation()

    const [pages, setPages] = useState([] as Array<string>)
    const [messages, setMessages] = useState(props.messages);
    const [translatedMessages, setTranslatedMessages] = useState(Array<string>());
    const [currentPage, setCurrentPage] = useState(1);
    const [symbolsPerPage, ] = useState(400);

    useEffect(() => {
        setMessages(props.messages);
    }, [props.messages]);


    const translateCmd = useCallback((cmd: string, args: string[] | undefined) => {
        if (args === undefined) {
            return t(cmdToTranslation(cmd))
        } else {
            const {mainCmd, parsedArgs} = cmdToFormatted(cmd, args)
            return t(mainCmd, parsedArgs)
        }
    }, [t])

    useEffect(() => {
        const newCmds = Object.keys(messages).filter(
            (cmd) => !translatedMessages.includes(cmd)
        )
        if (newCmds.length > 0) {
            let newPage = newCmds.reduce((acc, cmd) => {
                const translatedCmd = translateCmd(cmd, messages[cmd][0][1])
                return acc + translatedCmd
            }, "")
            let choppedPages = ""
            while (newPage.length > symbolsPerPage) {
                choppedPages += newPage.substring(0, symbolsPerPage) + "\n"
                newPage = newPage.substring(symbolsPerPage)
            }
            setPages([...pages, ...choppedPages, newPage])
            setTranslatedMessages([...translatedMessages, ...newCmds])
        }
    }, [messages, pages, translatedMessages, translateCmd, symbolsPerPage]);

    const displayPage = useCallback((): JSX.Element => {
        return (
            <p style={{
                textWrap: "wrap",
                margin: 0
            }}>
                {/*{currentPage >= 0 && currentPage < pages.length ? pages[currentPage - 1] : (() => {*/}
                {/*    console.log("Page out of range")*/}
                {/*    return ""*/}
                {/*})()}*/}
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
                <MdOutlineKeyboardDoubleArrowLeft key={key} onClick={callback} className={styles.button}/>
                :
                <MdOutlineKeyboardDoubleArrowLeft key={key} onClick={callback} className={styles.button}/>
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