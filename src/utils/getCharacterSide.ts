export const getCharacterSide = (characterLine: string | number | unknown): 'ally' | 'enemy' | null => {
    if (typeof characterLine === 'number') {
        return characterLine < 4 ? 'enemy' : 'ally'
    } else if (typeof characterLine === 'string') {
        return ['1', '2', '3'].includes(characterLine) ? 'enemy' : 'ally'
    } else {
        return null
    }
}

export const getCharacterSideWithSquare = (square: string): 'ally' | 'enemy' | null => {
    const characterLine = square.split('/')[0]
    return getCharacterSide(characterLine)
}
