export const isDescriptor = (descriptor: unknown): boolean => {
    return (
        !!descriptor &&
        typeof descriptor === 'string' &&
        descriptor.length > 0 &&
        /^[a-zA-Z]+:[a-zA-Z._-]+$/gm.test(descriptor)
    );
};
export const splitDescriptor = (full_descriptor: string): [string, string] => {
    if (!full_descriptor) {
        console.log('Descriptor is undefined');
        return ['local', 'invalid_asset'];
    }
    if (!isDescriptor(full_descriptor)) {
        return ['builtins', full_descriptor];
    }
    return full_descriptor.split(':').length === 2
        ? (full_descriptor.split(':') as [string, string])
        : ['local', 'invalid_asset'];
};
export const isValidSquareString = (square: string) => {
    return /^[1-6]\/[1-6]$/.test(square);
};
export const getCharacterSide = (characterLine: string | number | unknown): 'ally' | 'enemy' | null => {
    if (typeof characterLine === 'number') {
        return characterLine < 4 ? 'enemy' : 'ally';
    } else if (typeof characterLine === 'string') {
        return ['1', '2', '3'].includes(characterLine) ? 'enemy' : 'ally';
    } else {
        return null;
    }
};
export const getCharacterSideWithSquare = (square: string): 'ally' | 'enemy' | null => {
    const characterLine = square.split('/')[0];
    return getCharacterSide(characterLine);
};
