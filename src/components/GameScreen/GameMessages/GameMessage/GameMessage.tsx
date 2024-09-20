import useTString from '@hooks/useTString'

import { GameMessage as GameMessageInterface } from '@models/GameModels'

const GameMessage = ({ content }: { content: GameMessageInterface }) => {
    const { TString } = useTString()

    return content.map((msg, index) => {
        return (
            <>
                <p key={index}>{TString(msg)}</p>
            </>
        )
    })
}

export default GameMessage
