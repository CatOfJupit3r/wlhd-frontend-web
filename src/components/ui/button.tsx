import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { PulsingSpinner } from '@components/Spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import { Link, LinkProps } from '@tanstack/react-router';
import { cn } from '@utils';
import { ClassValue } from 'clsx';
import { ButtonHTMLAttributes, ComponentProps, forwardRef, MouseEvent, ReactNode, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const buttonVariants = cva(
    'text-sm inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground text-primary',
                outlineToDefault: 'border border-input bg-background hover:bg-primary/90 hover:text-primary-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'border border-transparent hover:bg-accent hover:text-accent-foreground',
                destructiveGhost:
                    'border border-transparent hover:border-destructive hover:text-destructive-foreground hover:bg-destructive/90',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'size-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    },
);
Button.displayName = 'Button';

const TimeoutButton = ({ timeoutTime, onClick, disabled, ...props }: { timeoutTime: number } & ButtonProps) => {
    const [isTimeout, setIsTimeout] = useState(false);
    const { t } = useTranslation('local', {
        keyPrefix: 'ui',
    });

    const handleClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            setIsTimeout(true);
            if (onClick) {
                onClick(e);
            }
            setTimeout(() => setIsTimeout(false), timeoutTime);
        },
        [onClick, timeoutTime],
    );

    return (
        <Button {...props} onClick={handleClick} disabled={disabled || isTimeout}>
            {isTimeout ? t('wait') : props.children}
        </Button>
    );
};

export interface iAwaitingButtonProps extends Omit<ButtonProps, 'onClick'> {
    onClick?: () => Promise<unknown>;
    thenCase?: () => void;
    catchCase?: (error: unknown) => void;
    finallyCase?: () => void;
}

const AwaitingButton = ({ onClick, thenCase, catchCase, finallyCase, disabled, ...props }: iAwaitingButtonProps) => {
    const [isAwaiting, setIsAwaiting] = useState(false);

    const handleClick = useCallback(async () => {
        if (isAwaiting || disabled) {
            return;
        }
        setIsAwaiting(true);
        try {
            if (onClick) {
                await onClick();
            }
            if (thenCase) {
                thenCase();
            }
        } catch (error) {
            if (catchCase) {
                catchCase(error);
            }
        } finally {
            setIsAwaiting(false);
            if (finallyCase) {
                finallyCase();
            }
        }
    }, [disabled, isAwaiting, onClick, thenCase, catchCase, finallyCase]);

    return (
        <Button {...props} onClick={handleClick} disabled={isAwaiting || disabled}>
            {isAwaiting ? <PulsingSpinner /> : props.children}
        </Button>
    );
};

const ButtonWithTooltip = ({
    tooltip,
    tooltipClassname,
    tooltipProps,
    tooltipContentProps,
    ...props
}: {
    tooltip: string;
    tooltipClassname?: ClassValue;
    tooltipProps?: Omit<ComponentProps<typeof Tooltip>, 'children'>;
    tooltipContentProps?: Omit<ComponentProps<typeof TooltipContent>, 'children'>;
} & ButtonProps) => {
    return (
        <Tooltip {...tooltipProps}>
            <TooltipTrigger asChild>
                <Button {...props} />
            </TooltipTrigger>
            <TooltipContent {...tooltipContentProps}>
                <p className={cn(tooltipClassname)}>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
};

const AwaitingButtonWithTooltip = ({
    onClick,
    thenCase,
    catchCase,
    finallyCase,
    tooltip,
    tooltipClassname,
    tooltipProps,
    tooltipContentProps,
    ...props
}: {
    onClick?: () => Promise<unknown>;
    thenCase?: () => void;
    catchCase?: (error: unknown) => void;
    finallyCase?: () => void;
    tooltip: string;
    tooltipClassname?: ClassValue;
    tooltipProps?: Omit<ComponentProps<typeof Tooltip>, 'children'>;
    tooltipContentProps?: Omit<ComponentProps<typeof TooltipContent>, 'children'>;
} & ButtonProps) => {
    return (
        <Tooltip {...tooltipProps}>
            <TooltipTrigger asChild>
                <AwaitingButton
                    {...props}
                    onClick={onClick}
                    thenCase={thenCase}
                    catchCase={catchCase}
                    finallyCase={finallyCase}
                />
            </TooltipTrigger>
            <TooltipContent {...tooltipContentProps}>
                <p className={cn(tooltipClassname)}>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
};

type ButtonLinkProps = Omit<ButtonProps, 'onClick'> & Pick<LinkProps, 'to' | 'search' | 'params'>;

const ButtonLink: React.FC<ButtonLinkProps> = ({ to, search, params, ...props }) => {
    return (
        <Button
            asChild
            className={cn(buttonVariants({ variant: props.variant, size: props.size, className: props.className }))}
            {...props}
        >
            <Link to={to} className={'transition-auto hover:text-auto'} search={search} params={params}>
                {props.children}
            </Link>
        </Button>
    );
};

type MutationButtonProps = {
    mutate: () => void;
    isPending: boolean;
    children?: ReactNode;
} & Omit<ButtonProps, 'onClick'>;

function MutationButton({ mutate, children, isPending, disabled, ...props }: MutationButtonProps) {
    const handleClick = () => {
        if (!isPending && !disabled) {
            mutate();
        }
    };

    return (
        <Button {...props} onClick={handleClick} disabled={disabled || isPending}>
            {isPending ? <PulsingSpinner /> : children}
        </Button>
    );
}

export {
    AwaitingButton,
    AwaitingButtonWithTooltip,
    Button,
    ButtonLink,
    buttonVariants,
    ButtonWithTooltip,
    MutationButton,
    TimeoutButton,
};
