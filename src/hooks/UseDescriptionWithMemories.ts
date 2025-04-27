import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CommonGameComponentInfoFields, GameComponentDecoration, MemoryType, PossibleMemory } from '@models/GameModels';
import { memoryValueToTranslation } from '@utils/game-display-tools';

export interface iPartialMemory {
    type: PossibleMemory['type'];
    value: PossibleMemory['value'];
}

const captureToMemory = (match: string): iPartialMemory => {
    // if string is two numbers separated by a `d`, it's a dice roll and should be returned as such
    const diceMatch = match.match(/(\d+)d(\d+)/);
    if (diceMatch) {
        return {
            type: 'dice',
            value: {
                sides: parseInt(diceMatch[2]),
                amount: parseInt(diceMatch[1]),
            },
        };
    }
    if (match === 'true')
        return {
            type: 'boolean',
            value: true,
        }; // if string is 'true', it's a boolean and should be returned as such
    if (match === 'false')
        return {
            type: 'boolean',
            value: false,
        }; // if string is 'false', it's a boolean and should be returned as such
    if (!isNaN(parseInt(match)))
        return {
            type: 'number',
            value: parseInt(match),
        }; // if string is a number, it's a number and should be returned as such
    return {
        type: 'string',
        value: match,
    }; // in other cases, return this is a string
};
const MEMORY_IN_DESCRIPTION_REGEX = /\[\{([^|]+)\|([^}]*?)}]/g;

export interface iUseDescriptionWithMemories {
    className?: string;
    description?: GameComponentDecoration['description'];
    memory: CommonGameComponentInfoFields['memory'];
}

export const useDescriptionWithMemories = ({ description, memory: memories }: iUseDescriptionWithMemories) => {
    const { t } = useTranslation();
    const translated = useMemo(() => {
        if (!description) return '???';
        return t(description);
    }, [description, t]);

    const formated = useMemo(() => {
        const matches = [...translated.matchAll(MEMORY_IN_DESCRIPTION_REGEX)];
        let newDescription = translated;
        matches.forEach((match) => {
            if (match.length < 3) return;
            const [fullMatch, matchKey, matchValue] = match;
            const memory: Partial<MemoryType> =
                memories && memories[matchKey] ? memories[matchKey] : captureToMemory(matchValue);

            const [memoryKey, args] = memoryValueToTranslation(memory, matchKey);
            newDescription = newDescription.replace(fullMatch, t(memoryKey, args));
        });
        return newDescription;
    }, [translated, memories]);

    return { formated, original: description };
};
