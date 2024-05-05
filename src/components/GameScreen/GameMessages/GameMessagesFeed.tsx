import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {selectAllMessages} from '../../../redux/slices/infoSlice'
import useTranslatableString from "../../../hooks/useTranslatableString";

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

    return (
        <div
            className="game-messages-feed"
            style={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'scroll',
                height: '100%',
                width: '100%',
                padding: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                borderRadius: '5px',
            }}
        >
            {messages ? (
                messages.map((msg) => {
                    return msg.map((content, index) => {
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
