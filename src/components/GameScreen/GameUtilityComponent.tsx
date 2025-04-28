import { useBattlefieldContext } from '@context/BattlefieldContext';
import { useAtomValue } from 'jotai/index';
import { useEffect } from 'react';

import GameMessage from '@components/GameScreen/GameMessages/GameMessage';
import { toastGameMessage } from '@components/toastifications/create-jsx-toasts';
import { actionsAtom } from '@jotai-atoms/actions-atom';
import { gameMessagesAtom, selectActiveCharacterAtom } from '@jotai-atoms/game-screen-atom';

const GameUtilityComponent = () => {
    const actions = useAtomValue(actionsAtom);
    const activeCharacter = useAtomValue(selectActiveCharacterAtom);
    const messages = useAtomValue(gameMessagesAtom);
    const { setActiveSquares, resetActiveSquares, resetInteractableSquares, resetClickedSquares } =
        useBattlefieldContext();

    useEffect(() => {
        // in normal game, messages are being appended to the end of the array
        // so we don't need some fancy memoization here. simple last element check is enough
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            toastGameMessage(<GameMessage content={lastMessage} />, {
                position: 'bottom-left',
                closeOnClick: true,
            });
        }
    }, [messages]);

    useEffect(() => {
        if (actions === null) {
            resetInteractableSquares();
            resetClickedSquares();
        }
    }, [actions]);

    useEffect(() => {
        if (!activeCharacter || activeCharacter.square === null) {
            resetActiveSquares();
        } else {
            setActiveSquares(`${activeCharacter.square.line}/${activeCharacter.square.column}`);
        }
    }, [activeCharacter]);

    return <div id={'battlefield-cleaner'} />;
};

export default GameUtilityComponent;
