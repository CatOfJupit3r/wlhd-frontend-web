import { GameMessage as GameMessageInterface } from '@type-defs/GameModels';

import useTString from '@hooks/useTString';

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
