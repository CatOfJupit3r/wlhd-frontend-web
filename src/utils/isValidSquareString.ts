export const isValidSquareString = (square: string) => {
    return /^[1-6]\/[1-6]$/.test(square);
};
