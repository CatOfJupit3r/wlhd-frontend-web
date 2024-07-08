import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const applyPrefix = (prefix: string, className: ClassValue, includeTwoDots?: boolean): ClassValue => {
    // adds a prefix to each TailwindCSS class in `className` params. Adds `:` in process.
    if (!className) {
        return className
    }
    let mapFunc: (value: string) => string
    if (includeTwoDots) {
        mapFunc = (value) => `${prefix}:${value}`
    } else {
        mapFunc = (value) => `${prefix}${value}`
    }
    return className
        .toString()
        .split(' ')
        .map(mapFunc)
        .reduce((acc, currentValue) => `${acc} ${currentValue}`, '')
}
