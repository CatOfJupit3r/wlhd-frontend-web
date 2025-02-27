export const randNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const chooseOneFrom = <T>(arr: T[]): T => {
    return arr[randNumber(0, arr.length - 1)];
};

export const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export default {
    randNumber,
    chooseOneFrom,
    uuid,
};
