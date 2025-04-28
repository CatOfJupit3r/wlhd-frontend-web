import { GameStateContainer } from '@type-defs/game-types';
import { useAtomValue } from 'jotai';
import { Fragment, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import GameMessage from '@components/GameScreen/GameMessages/GameMessage';
import { Separator } from '@components/ui/separator';
import { gameMessagesAtom } from '@jotai-atoms/game-screen-atom';

/*

This component displays info.loadedMessages from Redux store.

start refers to the start of slice of loaded array of messages on BACKEND
end refers to the end of slice of loaded array of messages on BACKEND
length refers to the length of ALL messages present on BACKEND
loaded refers to the actual array of messages loaded on FRONTEND


On each 'page' we display only 4 messages, each message is a string of translatable commands

At all time, we have (at most) 12 messages loaded on FRONTEND. 4 message for current page, 4 for previous page and 4 for next page
For now, support for offloading messages, so for now we keep all messages loaded on FRONTEND

*/

const GameMessagesFeed = () => {
    const { t } = useTranslation();

    const messages = useAtomValue(gameMessagesAtom);

    const reverseMessageContainer = useCallback((messages: GameStateContainer): GameStateContainer => {
        return messages.slice().reverse();
    }, []);

    return (
        <div className={'flex h-full w-full flex-col gap-2 overflow-auto px-4'}>
            {messages ? (
                reverseMessageContainer(messages).map((msg, indexBig) => {
                    return (
                        <Fragment key={indexBig}>
                            <GameMessage content={msg} />
                            <Separator />
                        </Fragment>
                    );
                })
            ) : (
                <p>{t('local:game.messages.loading')}</p>
            )}
        </div>
    );
};

export default GameMessagesFeed;
