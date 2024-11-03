import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { PulsingSpinner } from '@components/Spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { cn } from '@utils'
import { ClassValue } from 'clsx'
import { ButtonHTMLAttributes, forwardRef, MouseEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

const buttonVariants = cva(
    'text-sm inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                outlineToDefault: 'border border-input bg-background hover:bg-primary/90 hover:text-primary-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'border border-transparent hover:bg-accent hover:text-accent-foreground',
                destructiveGhost:
                    'border border-transparent hover:border-destructive hover:text-destructive-foreground',
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
    }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    }
)
Button.displayName = 'Button'

const TimeoutButton = ({ timeoutTime, onClick, disabled, ...props }: { timeoutTime: number } & ButtonProps) => {
    const [isTimeout, setIsTimeout] = useState(false)
    const { t } = useTranslation('local', {
        keyPrefix: 'ui',
    })

    const handleClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            setIsTimeout(true)
            if (onClick) {
                onClick(e)
            }
            setTimeout(() => setIsTimeout(false), timeoutTime)
        },
        [onClick, timeoutTime]
    )

    return (
        <Button {...props} onClick={handleClick} disabled={disabled || isTimeout}>
            {isTimeout ? t('wait') : props.children}
        </Button>
    )
}

const AwaitingButton = ({
    onClick,
    thenCase,
    catchCase,
    finallyCase,
    ...props
}: {
    onClick?: () => Promise<unknown>
    thenCase?: () => void
    catchCase?: (error: unknown) => void
    finallyCase?: () => void
} & Omit<ButtonProps, 'onClick'>) => {
    const [isAwaiting, setIsAwaiting] = useState(false)

    const handleClick = async () => {
        if (isAwaiting) {
            return
        }
        setIsAwaiting(true)
        try {
            if (onClick) {
                await onClick()
            }
            if (thenCase) {
                thenCase()
            }
        } catch (error) {
            if (catchCase) {
                catchCase(error)
            }
        } finally {
            setIsAwaiting(false)
            if (finallyCase) {
                finallyCase()
            }
        }
    }

    return (
        <Button {...props} onClick={handleClick} disabled={isAwaiting}>
            {isAwaiting ? <PulsingSpinner /> : props.children}
        </Button>
    )
}

const ButtonWithTooltip = ({
    tooltip,
    tooltipClassname,
    ...props
}: {
    tooltip: string
    tooltipClassname?: ClassValue
} & ButtonProps) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <Button {...props} asChild />
            </TooltipTrigger>
            <TooltipContent>
                <p className={cn(tooltipClassname)}>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    )
}

export { Button, AwaitingButton, TimeoutButton, buttonVariants, ButtonWithTooltip }
