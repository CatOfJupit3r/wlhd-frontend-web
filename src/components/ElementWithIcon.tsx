import { KeyboardEvent, MouseEvent } from 'react'

import { cn } from '@utils'

const ElementWithIcon = ({
    icon,
    element,
    iconPosition = 'together',
    className,
    onClick,
    onKeyDown,
    role,
    tabIndex,
}: {
    icon: JSX.Element
    element: JSX.Element
    iconPosition?: 'together' | 'opposite'
    className?: string
    onClick?: ((e: MouseEvent<HTMLDivElement>) => void) | (() => void)
    onKeyDown?: ((e: KeyboardEvent<HTMLDivElement>) => void) | (() => void)
    role?: string
    tabIndex?: number
}) => {
    return (
        <div
            className={cn(
                'margin-0 flex flex-row items-center gap-2 ',
                iconPosition === 'opposite' ? 'justify-between' : 'justify-normal',
                className ? ` ${className}` : ''
            )}
            onClick={onClick}
            onKeyDown={onKeyDown}
            role={role}
            tabIndex={tabIndex}
        >
            {iconPosition === 'together' ? (
                <>
                    {icon}
                    {element}
                </>
            ) : (
                <>
                    {element}
                    {icon}
                </>
            )}
        </div>
    )
}

export default ElementWithIcon
