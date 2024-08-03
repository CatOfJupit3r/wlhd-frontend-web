import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@lib/utils'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { ClassValue } from 'clsx'

type ProgressProps = {
    colored?: {
        empty?: ClassValue
        fill?: ClassValue
    }
    width?: ClassValue | 'w-full'
    height?: ClassValue | 'h-4'
    direction?: 'left-to-right' | 'up-to-down'
}

const Progress = forwardRef<
    ElementRef<typeof ProgressPrimitive.Root>,
    ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & ProgressProps
>(({ className, value, colored, width, height, direction, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            'relative overflow-hidden rounded-full',
            width || 'w-full',
            height || 'h-4',
            colored?.empty || 'bg-secondary',
            className
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className={cn('size-full flex-1 transition-all', colored?.fill || 'bg-primary')}
            style={{
                transform:
                    direction === 'up-to-down'
                        ? `translateY(${100 - (value || 0)}%)`
                        : `translateX(-${100 - (value || 0)}%)`,
            }}
        />
    </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }