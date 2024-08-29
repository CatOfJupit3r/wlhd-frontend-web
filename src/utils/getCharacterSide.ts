export const getCharacterSide = (characterLine: string | number): 'ally' | 'enemy' | null => {
    if (typeof characterLine === 'number') {
        return characterLine < 4 ? 'enemy' : 'ally'
    } else if (typeof characterLine === 'string') {
        return ['1', '2', '3'].includes(characterLine) ? 'enemy' : 'ally'
    } else {
        return null
    }
}
