import { DiceMemory, MemoryType, PossibleMemory } from '@type-defs/game-types';

import { isDescriptor, splitDescriptor } from '@utils/game-helpers';

interface IDuals {
    key: string;
    value: string;
}

interface iFancyAttribute {
    current: string;
    max: string;
    color: string;
}

export type FancyAttributeArray = iFancyAttribute[];

export const addPrefixBeforeDLC = (input: string, prefix: string): string => {
    const inputArray = input.split(':');
    const dlc = inputArray.shift();
    return `${dlc}:${prefix}.${inputArray.join('.')}`;
};

export const PrefixCollection = {
    tags: (input: string): string => addPrefixBeforeDLC(input, 'tags'),
    flags: (input: string): string => addPrefixBeforeDLC(input, 'flags'),
    attributes: (input: string): string => addPrefixBeforeDLC(input, 'attributes'),
    items: (input: string): string => addPrefixBeforeDLC(input, 'items'),
    weapons: (input: string): string => addPrefixBeforeDLC(input, 'weapons'),
    spells: (input: string): string => addPrefixBeforeDLC(input, 'spells'),
    statusEffects: (input: string): string => addPrefixBeforeDLC(input, 'statusEffects'),
    memories: (input: string): string => addPrefixBeforeDLC(input, 'memories'),
    characters: (input: string): string => addPrefixBeforeDLC(input, 'characters'),
};

export const extractDualAttributes = (
    attributes: Record<string, number>,
    ignored: string[],
): [IDuals[], Set<string>] => {
    const found_attribute_names = new Set<string>();
    const found_attributes: IDuals[] = [];
    for (const attribute in attributes) {
        if (ignored.includes(attribute) || found_attribute_names.has(attribute)) continue;
        if (attribute.endsWith('_attack')) {
            const attribute_name = attribute.slice(0, -7);
            const defense_attribute = `${attribute_name}_defense`;
            if (defense_attribute in attributes) {
                found_attributes.push({
                    key: attribute_name,
                    value: `${attributes[attribute]}/${attributes[defense_attribute]}`,
                });

                found_attribute_names.add(defense_attribute);
                found_attribute_names.add(attribute);
            }
        } else if (attribute.endsWith('_defense')) {
            const attribute_name = attribute.slice(0, -8);
            const attack_attribute = `${attribute_name}_attack`;
            if (attack_attribute in attributes) {
                found_attributes.push({
                    key: attribute_name,
                    value: `${attributes[attack_attribute]}/${attributes[attribute]}`,
                });

                found_attribute_names.add(attribute);
                found_attribute_names.add(attack_attribute);
            }
        }
    }

    return [found_attributes, found_attribute_names];
};

export const extractCurrentMaxBaseAttributes = (
    attributes: Record<string, number>,
    ignored: string[],
): FancyAttributeArray => {
    const res = [];
    for (const key in attributes) {
        if (ignored?.includes(key)) continue;
        if (!key.includes(':')) continue;
        const [dlc_tag, attribute] = key.split(':');
        const hasCurrent = attribute?.startsWith('current_');
        if (!hasCurrent) continue;
        const attributeWithoutCurrent = attribute.replace('current_', '');
        if (attributeWithoutCurrent === '') continue;
        const pseudoMaxAttributeKey = `${dlc_tag}:max_${attributeWithoutCurrent}`;
        const hasMax = pseudoMaxAttributeKey in attributes;
        if (hasMax) {
            res.push({
                current: key,
                max: pseudoMaxAttributeKey,
                color: AttributeColoringMap.get(attributeWithoutCurrent) ?? 'gray',
            });
            continue;
        }
        const pseudoBaseAttributeKey = `${dlc_tag}:base_${attributeWithoutCurrent}`;
        const hasBase = pseudoBaseAttributeKey in attributes;
        if (hasBase) {
            res.push({
                current: key,
                max: pseudoBaseAttributeKey,
                color: AttributeColoringMap.get(attributeWithoutCurrent) ?? 'gray',
            });
        }
    }
    return res;
};
export const AttributeColoringMap = new Map<string, string>([
    ['health', 'red'],
    ['action_points', 'green'],
    ['armor', 'amber'],
]);

type TranslationType = [string, Record<string, string>];

const injectSubPathToDescriptor = (descriptor: string, subPath: string): string => {
    if (!isDescriptor(descriptor)) return descriptor;
    const [dlc, key] = splitDescriptor(descriptor);
    return `${dlc}:${subPath}.${key}`;
};

export const memoryValueToTranslation = (value: Partial<MemoryType>, key?: string): TranslationType => {
    const { type, value: memoryValue, display_value } = value;

    if (display_value) return [display_value as string, {}];
    if (!type || memoryValue === undefined || memoryValue === null) return ['???', {}];
    switch (type as PossibleMemory['type'] | string) {
        case 'dice':
            if (typeof memoryValue == 'object' && memoryValue && 'amount' in memoryValue && 'sides' in memoryValue) {
                return [
                    'local:game.info-display.memories.dice',
                    {
                        amount: (memoryValue as DiceMemory['value']).amount.toString(),
                        sides: (memoryValue as DiceMemory['value']).sides.toString(),
                    },
                ];
            }
            break;
        case 'boolean':
            if (memoryValue) return ['local:game.info-display.memories.boolean.true', {}];
            else return ['local:game.info-display.memories.boolean.false', {}];
        case 'number':
            return [(memoryValue as number).toString(), {}];
        case 'element_of_hp_change':
            return [injectSubPathToDescriptor(memoryValue as string, 'elements_of_hp_change'), {}];
        case 'state':
            return [injectSubPathToDescriptor(memoryValue as string, 'states'), {}];
        case 'component_id':
        case 'string':
            return [(memoryValue as string) || '???', {}];
        case 'type_of_hp_change':
            if (memoryValue === 'damage') return ['builtins:hp_change_types.damage', {}];
            if (memoryValue === 'heal') return ['builtins:hp_change_types.heal', {}];
            return [(memoryValue as string) || '???', {}];
        case 'state_change_mode':
            if (memoryValue === '+') return ['+', {}];
            if (memoryValue === '-') return ['-', {}];
            return [(memoryValue as string) || '???', {}];
        default:
            return ['???', {}];
    }
    return ['???', {}];
};
