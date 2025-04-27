import { useCharacterByIdInEditor, useCombatEditor } from '@context/combat-editor';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import React, { RefObject, useCallback } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { CharacterCard } from '@components/GameScreen/turn-order-display';
import { Sortable } from '@components/dnd-extensions/sortable';
import { Button, ButtonWithTooltip } from '@components/ui/button';
import { ScrollArea, ScrollBar } from '@components/ui/scroll-area';
import { cn } from '@utils';

const CharacterCardInEditor: React.FC<{
    characterId: string;
    index: number;
    turnId: string;
    disableAnimation?: boolean;
}> = ({ characterId, disableAnimation, turnId, index, ...props }) => {
    const { makeCharacterActive, activeCharacterIndex, changeTurnOrder, turnOrder } = useCombatEditor();
    const character = useCharacterByIdInEditor(characterId);

    const handleDelete = useCallback(() => {
        const newTurnOrder = [...turnOrder];
        newTurnOrder.splice(index, 1);
        changeTurnOrder(newTurnOrder);
        if (activeCharacterIndex === index && activeCharacterIndex >= newTurnOrder.length) {
            makeCharacterActive(index - 1);
        }
    }, [index, turnOrder, activeCharacterIndex, changeTurnOrder]);

    if (!character) return null;

    return (
        <div className={'relative flex flex-col gap-1'} {...props}>
            <CharacterCard
                character={{
                    ...character,
                    controlledByYou: false,
                }}
                className={'w-14'}
                isActive={index === activeCharacterIndex}
                initial={undefined}
                exit={undefined}
                animate={{ y: 0, opacity: 1 }}
                {...(disableAnimation
                    ? {
                          layout: undefined,
                          transition: undefined,
                          style: undefined,
                      }
                    : {})}
                onDoubleClick={() => {
                    makeCharacterActive(index ?? 1);
                }}
                key={turnId}
            />
            <Button
                className={'absolute right-0 top-0 size-4 p-0 text-sm'}
                onClick={handleDelete}
                variant={'destructive'}
            >
                <RiDeleteBin6Line />
            </Button>
        </div>
    );
};

const TurnOrderEditor = () => {
    const { turnOrder, changeTurnOrder, activeCharacterIndex, makeCharacterActive } = useCombatEditor();

    return (
        <div className={'flex flex-row gap-2'}>
            <ButtonWithTooltip
                variant={'destructive'}
                tooltip={'Clear ' + 'turn order'}
                tooltipClassname={'size-full'}
                onClick={() => {
                    changeTurnOrder([]);
                }}
                className={'size-10 p-2.5'}
            >
                <RiDeleteBin6Line className={'text-sm'} />
            </ButtonWithTooltip>
            <Sortable
                style={{ width: '100%' }}
                useDragOverlay
                renderItem={({ value, index, ref, listeners, style, className, dragOverlay }) => {
                    const character = turnOrder.find((turn) => turn.id === value);
                    if (!character) return null;
                    return (
                        <div
                            className={cn(
                                'relative z-10 flex flex-col gap-1',
                                className,
                                dragOverlay ? 'animate-shaking' : '',
                            )}
                            ref={ref as RefObject<HTMLDivElement>}
                            key={value}
                            style={style}
                            {...listeners}
                        >
                            <CharacterCardInEditor
                                characterId={character.character}
                                index={index!}
                                turnId={value as string}
                                disableAnimation={dragOverlay}
                            />
                        </div>
                    );
                }}
                activationConstraint={{
                    delay: 150, // to allow for the user to double click on the item
                    tolerance: 10, // to allow for the user to drag the item
                }}
                changeItems={(items) => {
                    changeTurnOrder(items.map((item) => turnOrder.find((turn) => turn.id === item)!));
                    // if current active character was moved, then make it active again
                    if (activeCharacterIndex >= items.length) {
                        makeCharacterActive(0);
                        return;
                    }
                    if (items[activeCharacterIndex] !== turnOrder[activeCharacterIndex].id) {
                        const newIndex = items.indexOf(turnOrder[activeCharacterIndex].id);
                        if (newIndex !== -1) {
                            makeCharacterActive(newIndex);
                        }
                    }
                }}
                items={turnOrder.map(({ id }) => id)}
                modifiers={[restrictToHorizontalAxis]}
                strategy={horizontalListSortingStrategy}
                Container={({ children }) => {
                    return (
                        <ScrollArea className={'w-full max-w-lg overflow-y-visible'}>
                            <AnimatePresence>
                                <div className={'mb-3 mr-0 flex flex-row gap-1 overflow-x-auto overflow-y-visible'}>
                                    {children}
                                </div>
                            </AnimatePresence>
                            <ScrollBar orientation={'horizontal'} />
                        </ScrollArea>
                    );
                }}
            />
        </div>
    );
};

export default TurnOrderEditor;
