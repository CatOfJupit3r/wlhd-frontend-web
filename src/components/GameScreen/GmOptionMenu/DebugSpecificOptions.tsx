import { useBattlefieldContext } from '@context/BattlefieldContext';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { SquareMultiSelect } from '@components/common/square-multi-select';
import { Button } from '@components/ui/button';
import { characterOrderAtom } from '@jotai-atoms/game-screen-atom';
import { CharacterInTurnOrder } from '@models/GameModels';
import { RandomizeUtils } from '@utils';

/*

This component is built for /game-test route and allows for better control over game state for testing purposes.

 */

const MOCK_TURN_ORDER_CHARACTERS: Array<CharacterInTurnOrder> = [
    {
        descriptor: 'coordinator:hero',
        decorations: {
            name: 'The Hero',
            description: 'An ordinary farmer who gained the strongest power capable of defeating The Demon King.',
            sprite: 'ally',
        },
        square: {
            line: 4,
            column: 5,
        },
        controlledByYou: true,
        id_: '1',
    },
    {
        descriptor: 'builtins:target_dummy',
        decorations: {
            name: 'builtins:characters.target_dummy.name',
            description: 'builtins:characters.target_dummy.desc',
            sprite: 'builtins:fire',
        },
        square: {
            line: 3,
            column: 3,
        },
        controlledByYou: true,
        id_: '2',
    },
    {
        descriptor: 'builtins:target_dummy',
        decorations: {
            name: 'builtins:characters.target_dummy.name',
            description: 'builtins:characters.target_dummy.desc',
            sprite: 'builtins:unavailable',
        },
        square: {
            line: 3,
            column: 4,
        },
        controlledByYou: true,
        id_: '3',
    },
    {
        descriptor: 'builtins:target_dummy',
        decorations: {
            name: 'builtins:characters.target_dummy.name',
            description: 'builtins:characters.target_dummy.desc',
            sprite: 'builtins:unavailable',
        },
        square: {
            line: 3,
            column: 4,
        },
        controlledByYou: true,
        id_: '3',
    },
    {
        descriptor: 'builtins:target_dummy_large',
        decorations: {
            name: 'builtins:characters.target_dummy_large.name',
            description: 'builtins:characters.target_dummy_large.desc',
            sprite: 'builtins:target_dummy',
        },
        square: {
            line: 3,
            column: 6,
        },
        controlledByYou: true,
        id_: '5',
    },
    {
        controlledByYou: false,
        descriptor: 'builtins:target_dummy',
        decorations: {
            name: 'builtins:characters.target_dummy.name',
            description: 'builtins:characters.target_dummy.desc',
            sprite: 'builtins:target_dummy',
        },
        square: {
            line: 3,
            column: 2,
        },
        id_: '6',
    },
];

const RandomizeTurnOrder = () => {
    const setTurnOrder = useSetAtom(characterOrderAtom);

    const handleRandomizeButtonClick = () => {
        const newOrder = [...MOCK_TURN_ORDER_CHARACTERS];
        const shuffled = newOrder.sort(() => 0.5 - Math.random());
        const howManyToPop = RandomizeUtils.randNumber(0, 2);
        for (let i = 0; i < howManyToPop; i++) {
            shuffled.pop();
        }
        shuffled.splice(RandomizeUtils.randNumber(0, shuffled.length - 1), 0, null as never);
        setTurnOrder(shuffled);
    };

    return <Button onClick={handleRandomizeButtonClick}>Randomize Turn Order</Button>;
};

const ShiftTurnOrder = () => {
    const [turnOrder, setTurnOrder] = useAtom(characterOrderAtom);

    const handleShiftButtonClick = () => {
        const newOrder = [...turnOrder];
        const first = newOrder.shift();
        newOrder.push(first as never);
        if (newOrder[0] === null) {
            const second = newOrder.shift();
            newOrder.push(second as never);
        }
        setTurnOrder(newOrder);
    };

    return <Button onClick={handleShiftButtonClick}>Shift Turn Order</Button>;
};

const AddAOEHighlightToSquares = () => {
    const [squares, setSquares] = useState<string[]>([]);
    const { addAOEHighlight } = useBattlefieldContext();

    useEffect(() => {
        addAOEHighlight(squares);
    }, [squares]);

    return (
        <div className={'flex w-full flex-col gap-2'}>
            <div className={'flex flex-col gap-2'}>
                <p className={'text-lg font-medium'}>Squares to highlight</p>
                <div className={'flex flex-col gap-2'}>
                    <SquareMultiSelect onChange={setSquares} values={squares} />
                </div>
            </div>
        </div>
    );
};

const DebugSpecificOptions = () => {
    return (
        <div className={'flex w-full flex-col gap-2'}>
            <RandomizeTurnOrder />
            <ShiftTurnOrder />
            <AddAOEHighlightToSquares />
        </div>
    );
};

export default DebugSpecificOptions;
