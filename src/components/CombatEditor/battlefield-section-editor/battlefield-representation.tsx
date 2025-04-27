import Battlefield from '@components/Battlefield/Battlefield';
import { Button } from '@components/ui/button';
import { useBattlefieldContext } from '@context/BattlefieldContext';
import { useCombatEditor } from '@context/combat-editor';
import { Battlefield as BattlefieldModel } from '@models/GameModels';
import { ReactNode, useCallback, useEffect } from 'react';
import { BiAddToQueue } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';

export const BattlefieldRepresentation = ({
    setClickedSquare,
}: {
    setClickedSquare: (square: string | null) => void;
}) => {
    const { battlefield, removeCharacter, addCharacterToTurnOrder } = useCombatEditor();
    const {
        changeBattlefield,
        setInteractableSquares,
        changeOnClickTile,
        incrementClickedSquares,
        resetClickedSquares,
        changeBonusTileTooltipGenerator,
    } = useBattlefieldContext();

    const updateBattlefield = useCallback(() => {
        const newBattlefield: {
            [square: string]: BattlefieldModel['pawns'][string];
        } = {};
        for (const square in battlefield) {
            const [lineStr, columnStr] = square.split('/');
            if (!lineStr || !columnStr || !battlefield[square]) {
                continue;
            }
            const line = parseInt(lineStr);
            const column = parseInt(columnStr);
            if (isNaN(line) || isNaN(column)) {
                continue;
            }
            newBattlefield[square] = {
                character: {
                    decorations: battlefield[square].decorations,
                    square: { line, column },
                    health: {
                        current: battlefield[square].attributes['builtins:current_health'],
                        max: battlefield[square].attributes['builtins:max_health'],
                    },
                    action_points: {
                        current: battlefield[square].attributes['builtins:current_action_points'],
                        max: battlefield[square].attributes['builtins:max_action_points'],
                    },
                    armor: {
                        current: battlefield[square].attributes['builtins:current_armor'],
                        base: battlefield[square].attributes['builtins:base_armor'],
                    },
                    statusEffects: battlefield[square].statusEffects,
                },
            };
        }
        changeBattlefield(
            {
                pawns: newBattlefield,
                effects: [],
            },
            { keepActive: true, keepClicked: true, keepInteractable: true },
        );
        setInteractableSquares(
            ...(() => {
                const interactableSquares: Array<string> = [];
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 6; j++) {
                        interactableSquares.push(`${i + 1}/${j + 1}`);
                    }
                }
                return interactableSquares;
            })(),
        );
        changeOnClickTile((square) => {
            if (square) {
                resetClickedSquares();
                incrementClickedSquares(square);
            }
            setClickedSquare(square ?? null);
        });
        changeBonusTileTooltipGenerator((square) => {
            if (!square) return null;
            const characterIsPreset = !!(battlefield[square] && battlefield[square].descriptor);
            if (!characterIsPreset) return null;
            const buttons: Array<{
                text: string | ReactNode;
                onClick: () => void;
                variant: 'default' | 'destructive' | 'secondary' | null;
                disabled: boolean;
            }> = [
                {
                    text: <BiAddToQueue />,
                    onClick: () => {
                        if (!characterIsPreset) return;
                        const characterId = battlefield[square].id_;
                        addCharacterToTurnOrder(characterId);
                    },
                    variant: 'default',
                    disabled: !characterIsPreset,
                },
                {
                    text: <RiDeleteBin6Line />,
                    onClick: () => {
                        removeCharacter(square);
                    },
                    variant: 'destructive',
                    disabled: !characterIsPreset,
                },
            ];
            return buttons.map((button, index) => (
                <Button
                    key={index}
                    onClick={button.onClick}
                    variant={button.variant}
                    className={'w-full'}
                    disabled={button.disabled}
                >
                    {button.text}
                </Button>
            ));
        });
    }, [battlefield, removeCharacter, addCharacterToTurnOrder]);

    useEffect(() => {
        setTimeout(() => {
            updateBattlefield();
        });
    }, [battlefield]);

    return <Battlefield />;
};
