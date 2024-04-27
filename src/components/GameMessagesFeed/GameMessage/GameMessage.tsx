import useTranslatableString from '../../../hooks/useTranslatableString'
import { GameMessage as GameMessageInterface } from '../../../models/GameHandshake'

const GameMessage = ({ content }: { content: GameMessageInterface }) => {
    const tString = useTranslatableString()

    return content.map((msg, index) => {
        return (
            <>
                <p key={index}>{tString(msg)}</p>
            </>
        )
    })
}

export default GameMessage
