import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {selectAllMessages} from '../../../redux/slices/infoSlice'
import useTranslatableString from "../../../hooks/useTranslatableString";
import styles from './GameMessagesFeed.module.css'
import {GameStateContainer} from "../../../models/Battlefield";
import {useCallback} from "react";
import {GameMessage} from "../../../models/GameHandshake";

/*

This component mainly manipulates info.loadedMessages from Redux store.

start refers to the start of slice of loaded array of messages on BACKEND
end refers to the end of slice of loaded array of messages on BACKEND
length refers to the length of ALL messages present on BACKEND
loaded refers to the actual array of messages loaded on FRONTEND


On each 'page' we display only 4 messages, each message is a string of translatable commands

At all time, we have (at most) 12 messages loaded on FRONTEND. 4 message for current page, 4 for previous page and 4 for next page
For now, support for offloading messages, so for now we keep all messages loaded on FRONTEND

*/


const GameMessagesFeed = () => {
    const { tstring } = useTranslatableString()
    const { t } = useTranslation()

    const messages = useSelector(selectAllMessages)

    const reverseMessageContainer = useCallback((messages: GameStateContainer): GameStateContainer => {
        return messages.slice().reverse()
    }, [])

    const reverseGameMessages = useCallback((messages: GameMessage): GameMessage => {
        return messages.slice().reverse()
    }, [])

    return (
        <div
            className={styles.stateFeed}
        >
            {messages ? (
                reverseMessageContainer(messages).map((msg) => {
                    return reverseGameMessages(msg).map((content, index) => {
                        return <p key={index}>{tstring(content)}</p>
                    })
                })
            ) : (
                <p>{t('local:game.messages.loading')}</p>
            )}
        </div>
    )
}

export default GameMessagesFeed
