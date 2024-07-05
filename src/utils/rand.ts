export const randNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const chooseOneFrom = <T>(arr: T[]): T => {
    return arr[randNumber(0, arr.length - 1)]
}

export default {
    randNumber,
    chooseOneFrom,
}
