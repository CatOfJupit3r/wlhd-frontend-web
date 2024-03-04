import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {cmdToFormatted, cmdToTranslation} from "../utils/cmdConverters";
import {
    TbSquareChevronLeft,
    TbSquareChevronLeftFilled,
    TbSquareChevronRight,
    TbSquareChevronRightFilled
} from "react-icons/tb";

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
            <p>
                {currentPage >= 0 && currentPage < pages.length ? pages[currentPage - 1] : (() => {
                    console.log("Page out of range")
                    return ""
                })()}
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

    return (
        <div style={{
            display: "grid",
            width: "fit-content",
            height: "fit-content",
            overflow: "hidden",

        }} id={"pages-container"}>
            {
                displayPage()
            }
            <div id={"page-manipulators"}>
                {
                    currentPage >= pages.length && currentPage <= 1 ? // I'm not sure if this is correct statement. need to check
                    <>
                        <TbSquareChevronLeft /> {/* we can't move back, because there are no pages before 1 */}
                        <TbSquareChevronRight  /> {/* we can't move forward, because there's no page number bigger than length of [...pages] */}
                    </>
                       :
                    <>
                        {
                            currentPage < pages.length ?
                                <TbSquareChevronLeftFilled onClick={() => handlePrev()} />
                                :
                                <TbSquareChevronLeft />
                        }
                        {
                            currentPage <= 1 ?
                                <TbSquareChevronRightFilled onClick={() => handleNext()}/>
                                :
                                <TbSquareChevronRight  />
                        }
                    </>
                }
            </div>
        </div>
    );
};

export default GameStateFeed;