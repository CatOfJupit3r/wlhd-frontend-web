import * as ProgressPrimitive from '@radix-ui/react-progress';
import { ClassValue } from 'clsx';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';

import { cn } from '@utils';

type ProgressProps = {
    colored?: {
        empty?: ClassValue;
        fill?: ClassValue;
    };
    width?: ClassValue | 'w-full';
    height?: ClassValue | 'h-4';
    direction?: 'left-to-right' | 'up-to-down';
};

const Progress = forwardRef<
    ComponentRef<typeof ProgressPrimitive.Root>,
    ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & ProgressProps
>(({ className, value, colored, width, height, direction, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            'relative overflow-hidden rounded-full',
            width || 'w-full',
            height || 'h-4',
            colored?.empty || 'bg-secondary',
            className,
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
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
