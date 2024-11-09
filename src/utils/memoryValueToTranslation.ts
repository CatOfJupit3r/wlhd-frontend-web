import { DiceMemory, MemoryType } from '@models/GameModels'

type TranslationType = [string, Record<string, string>]

export const memoryValueToTranslation = (value: Partial<MemoryType>): TranslationType => {
    const { type, value: memoryValue, display_value } = value

    if (display_value) return [display_value as string, {}]
    if (!type || memoryValue === undefined || memoryValue === null) return ['???', {}]
    switch (type) {
        case 'dice':
            if (typeof memoryValue == 'object' && memoryValue && 'amount' in memoryValue && 'sides' in memoryValue) {
                return [
                    'local:game.info-display.memories.dice',
                    {
                        amount: (memoryValue as DiceMemory['value']).amount.toString(),
                        sides: (memoryValue as DiceMemory['value']).sides.toString(),
                    },
                ]
            }
            break
        case 'boolean':
            if (memoryValue) return ['local:game.info-display.memories.boolean.true', {}]
            else return ['local:game.info-display.memories.boolean.false', {}]
        case 'number':
            return [(memoryValue as number).toString(), {}]
        case 'string':
            return [(memoryValue as string) || '???', {}]
        default:
            return ['???', {}]
    }
    return ['???', {}]
}
