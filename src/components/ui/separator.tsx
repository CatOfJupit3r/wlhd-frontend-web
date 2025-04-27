import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { ComponentPropsWithoutRef, ComponentRef, FC, forwardRef } from 'react';

import { cn } from '@utils';

const Separator = forwardRef<
    ComponentRef<typeof SeparatorPrimitive.Root>,
    ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
            'shrink-0 bg-border',
            orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
            className,
        )}
        {...props}
    />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

const VerticalSeparator: FC<
    Omit<ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>, 'orientation'> & {
        ref?: ComponentRef<typeof SeparatorPrimitive.Root>;
    }
    // @ts-expect-error ref mismatch
> = ({ ref, ...props }) => <Separator ref={ref} orientation="vertical" {...props} />;

const HorizontalSeparator: FC<
    Omit<ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>, 'orientation'> & {
        ref?: ComponentRef<typeof SeparatorPrimitive.Root>;
    }
    // @ts-expect-error ref mismatch
> = ({ ref, ...props }) => <Separator ref={ref} orientation="horizontal" {...props} />;

export { HorizontalSeparator, Separator, VerticalSeparator };
