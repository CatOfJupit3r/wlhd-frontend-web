import GameMessage from '@components/GameScreen/GameMessages/GameMessage';
import { toastGameMessage } from '@components/toastifications/create-jsx-toasts';
import { useBattlefieldContext } from '@context/BattlefieldContext';
import { selectActions, selectActiveCharacter, selectAllMessages } from '@redux/slices/gameScreenSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const GameUtilityComponent = () => {
    const actions = useSelector(selectActions);
    const activeCharacter = useSelector(selectActiveCharacter);
    const { setActiveSquares, resetActiveSquares, resetInteractableSquares, resetClickedSquares } =
        useBattlefieldContext();
    const messages = useSelector(selectAllMessages);

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
