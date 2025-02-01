import { DiceMemory, MemoryType, PossibleMemory } from '@models/GameModels';
import { isDescriptor, splitDescriptor } from '@utils/descriptorTools';

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
