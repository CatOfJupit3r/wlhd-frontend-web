export const getPercentage = (current: number, max: number): number => {
    return Math.max(Math.min((current / (max || 1)) * 100, 100), 0)
}
