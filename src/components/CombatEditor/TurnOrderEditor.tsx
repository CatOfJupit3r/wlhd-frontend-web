import BetterScrollableContainer from '@components/BetterScrollableContainer';
import { CharacterCard } from '@components/GameScreen/TurnOrderDisplay';
import { Button } from '@components/ui/button';
import { useCombatEditorContext } from '@context/CombatEditorContext';
import React, { useCallback, useMemo } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

const CharacterCardInEditor: React.FC<{
    characterID: string;
    index: number;
}> = ({ characterID, index, ...props }) => {
    const { battlefield, makeCharacterActive, activeCharacterIndex, changeTurnOrder, turnOrder } =
        useCombatEditorContext();

    const character = useMemo(
        () => Object.values(battlefield).find((character) => character.id_ === characterID),
        [battlefield, characterID],
    );

    const handleUpArrow = useCallback(() => {
        if (index === 0) return;
        const newTurnOrder = [...turnOrder];
        newTurnOrder[index] = turnOrder[index - 1];
        newTurnOrder[index - 1] = turnOrder[index];
        changeTurnOrder(newTurnOrder);
        if (activeCharacterIndex === index) {
            makeCharacterActive(index - 1);
        } else if (activeCharacterIndex === index - 1) {
            makeCharacterActive(index);
        }
    }, [index, turnOrder, activeCharacterIndex]);

    const handleDownArrow = useCallback(() => {
        if (index === turnOrder.length - 1) return;
        const newTurnOrder = [...turnOrder];
        newTurnOrder[index] = turnOrder[index + 1];
        newTurnOrder[index + 1] = turnOrder[index];
        changeTurnOrder(newTurnOrder);
        if (activeCharacterIndex === index) {
            makeCharacterActive(index + 1);
        } else if (activeCharacterIndex === index + 1) {
            makeCharacterActive(index);
        }
    }, [index, turnOrder, activeCharacterIndex]);

    const handleDelete = useCallback(() => {
        const newTurnOrder = [...turnOrder];
        newTurnOrder.splice(index, 1);
        changeTurnOrder(newTurnOrder);
        if (activeCharacterIndex === index && activeCharacterIndex >= newTurnOrder.length) {
            makeCharacterActive(index - 1);
        }
    }, [index, turnOrder, activeCharacterIndex]);

    if (!character) {
        return null;
    }

    return (
        <div className={'flex flex-col gap-1'}>
            <CharacterCard
                character={{
                    ...character,
                    controlledByYou: false,
                }}
                isActive={index === activeCharacterIndex}
                onDoubleClick={() => {
                    makeCharacterActive(index ?? 1);
                }}
                {...props}
            />
            <div className={'flex flex-row'}>
                <Button onClick={handleUpArrow}>
                    <FaArrowUp />
                </Button>
                <Button onClick={handleDelete}>
                    <RiDeleteBin6Line />
                </Button>
                <Button onClick={handleDownArrow}>
                    <FaArrowDown />
                </Button>
            </div>
        </div>
    );
};

const TurnOrderEditor = () => {
    const { turnOrder } = useCombatEditorContext();

    return (
        <BetterScrollableContainer>
            {turnOrder.map((characterID, index) => (
                <CharacterCardInEditor key={index} characterID={characterID} index={index} />
            ))}
        </BetterScrollableContainer>
    );
};

export default TurnOrderEditor;
