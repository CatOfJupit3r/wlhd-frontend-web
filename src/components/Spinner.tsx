import React from 'react'
import { cn } from '@libutils'

const Spinner = ({
    type,
    color,
    size,
    className,
}: {
    type: 'spin' | 'pulse'
    color?: string
    size?: number
    className?: string
}) => {
    return (
        <div
            className={cn(
                'inline-block',
                type === 'spin' ? 'animate-spinner-border border-solid border-r-transparent }' : 'animate-spinner-grow',
                className
            )}
            style={{
                width: `${size || 2}rem`,
                height: `${size || 2}rem`,
                borderRadius: '50%',
                verticalAlign: '-0.125',
                ...(type === 'spin'
                    ? {
                          borderRightColor: 'transparent',
                          borderLeftColor: color || 'black',
                          borderTopColor: color || 'black',
                          borderBottomColor: color || 'black',
                          borderWidth: `${(size || 2) / 5}rem`,
                      }
                    : {
                          backgroundColor: color || 'black',
                          opacity: 0,
                      }),
            }}
        />
    )
}

export default Spinner
