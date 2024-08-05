export const getCharacterSide = (characterLine: string): 'ally' | 'enemy' | null => {
    if (!characterLine) return null
    return ['1', '2', '3'].includes(characterLine) ? 'enemy' : 'ally'
}
