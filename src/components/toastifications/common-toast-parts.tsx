import { cn } from '@utils';
import { FC, ReactNode } from 'react';

export const ToastBody: FC<{ children?: ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <div
            className={cn(
                'flex w-full gap-2 overflow-hidden pr-4 transition-all sm:flex-col md:max-w-[420px]',
                className,
            )}
        >
            {children}
        </div>
    );
};

export const ToastTitle: FC<{ children?: ReactNode; className?: string }> = ({ children, className }) => {
    return <p className={cn('text-lg font-semibold text-accent-foreground', className)}>{children}</p>;
};

export const ToastDescription: FC<{ children?: ReactNode; className?: string }> = ({ children, className }) => {
    return <p className={cn('w-full text-sm', className)}>{children}</p>;
};
