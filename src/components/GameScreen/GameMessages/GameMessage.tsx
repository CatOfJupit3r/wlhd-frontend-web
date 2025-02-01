import useTString from '@hooks/useTString';

import { GameMessage as GameMessageInterface } from '@models/GameModels';

const GameMessage = ({ content }: { content: GameMessageInterface }) => {
    const { TString } = useTString();

    return (
        <div className={'flex w-full flex-col gap-1 break-words'}>
            {content.map((msg, index) => {
                return <p key={index}>{TString(msg)}</p>;
            })}
        </div>
    );
};

export default GameMessage;
