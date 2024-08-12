import React from 'react'

export const getHandlerChange = (max: number, min: number, set: (value: number) => void, fallbackValue: number = 1) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === '') {
            set(fallbackValue)
        } else {
            const parsedValue = parseInt(value)
            if (isNaN(parsedValue)) {
                set(fallbackValue)
            } else if (parsedValue < min) {
                set(min)
            } else if (parsedValue > max) {
                set(max)
            } else {
                set(parsedValue)
            }
        }
    }
}
