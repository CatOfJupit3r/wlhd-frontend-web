import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardDoubleArrowRight,
} from 'react-icons/md'
import { useSelector } from 'react-redux'
import useTranslatableString from '../../hooks/useTranslatableString'
import { selectAllMessages } from '../../redux/slices/infoSlice'
import styles from './GameStateFeed.module.css'

const GameStateFeed = () => {
    const { t } = useTranslation()
    const translatableString = useTranslatableString()

    const messages = useSelector(selectAllMessages)

    const [pages, setPages] = useState([] as Array<string>)
    const [translatedMessages, setTranslatedMessages] = useState(Array<string>())
    const [currentPage, setCurrentPage] = useState(1)
    const [symbolsPerPage] = useState(400)

    useEffect(() => {
        try {
            if (Object.keys(messages).length === 0) {
                return
            }
            const memoryCells = Object.keys(messages).filter((cell) => !translatedMessages.includes(cell))
            if (memoryCells.length > 0) {
                let newPage = ''
                for (const address of memoryCells) {
                    const message = messages[address]
                    for (const cmd of message) {
                        newPage += translatableString(cmd) + '\n'
                    }
                }
                let choppedPages = ''
                while (newPage.length > symbolsPerPage) {
                    choppedPages += newPage.substring(0, symbolsPerPage) + '\n'
                    newPage = newPage.substring(symbolsPerPage)
                }
                setPages([...pages, ...choppedPages, newPage])
                setTranslatedMessages([...translatedMessages, ...memoryCells])
            }
        } catch (e) {
            console.log(e)
        }
    }, [messages, pages, translatedMessages, symbolsPerPage])

    const displayPage = useCallback((): JSX.Element => {
        return (
            <p
                style={{
                    textWrap: 'wrap',
                    marginLeft: '10px',
                    marginRight: '10px',
                }}
            >
                {pages[currentPage - 1]}
            </p>
        )
    }, [currentPage, pages])

    const handleNext = useCallback(() => {
        if (currentPage < pages.length) {
            setCurrentPage(currentPage + 1)
        } else {
            console.log('No more pages')
        }
    }, [currentPage, pages])

    const handlePrev = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        } else {
            console.log('No more pages')
        }
    }, [currentPage])

    const absoluteLeft = (key: string, filled: boolean, callback?: () => void) => {
        return filled ? (
            <MdOutlineKeyboardDoubleArrowLeft key={key} onClick={callback} className={styles.activeButton} />
        ) : (
            <MdOutlineKeyboardDoubleArrowLeft key={key} onClick={callback} className={styles.inactiveButton} />
        )
    }

    const arrowLeft = (key: string, filled: boolean, callback?: () => void) => {
        return filled ? (
            <MdOutlineKeyboardArrowLeft key={key} onClick={callback} className={styles.activeButton} />
        ) : (
            <MdOutlineKeyboardArrowLeft key={key} onClick={callback} className={styles.inactiveButton} />
        )
    }

    const absoluteRight = (key: string, filled: boolean, callback?: () => void) => {
        return filled ? (
            <MdOutlineKeyboardDoubleArrowRight key={key} onClick={callback} className={styles.activeButton} />
        ) : (
            <MdOutlineKeyboardDoubleArrowRight key={key} onClick={callback} className={styles.inactiveButton} />
        )
    }

    const arrowRight = (key: string, filled: boolean, callback?: () => void) => {
        return filled ? (
            <MdOutlineKeyboardArrowRight key={key} onClick={callback} className={styles.activeButton} />
        ) : (
            <MdOutlineKeyboardArrowRight key={key} onClick={callback} className={styles.inactiveButton} />
        )
    }

    return (
        <div className={styles.stateFeed} id={'game-state-feed'}>
            <div className={styles.pageContainer}>{displayPage()}</div>
            <div id={'page-manipulators'} className={styles.pageManipulators}>
                <div id={'left-arrows'}>
                    {absoluteLeft('absolute-left', currentPage > 1, () => setCurrentPage(1))}
                    {currentPage > 1 ? arrowLeft('left', true, () => handlePrev()) : arrowLeft('left', false)}
                </div>
                <div id={'right-arrows'}>
                    {currentPage < pages.length
                        ? arrowRight('right', true, () => handleNext())
                        : arrowRight('right', false)}
                    {absoluteRight('absolute-right', currentPage < pages.length, () => setCurrentPage(pages.length))}
                </div>
            </div>
        </div>
    )
}

export default GameStateFeed
