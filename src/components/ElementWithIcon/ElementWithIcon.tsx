import React from 'react'
import styles from './ElementWithIcon.module.css'

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
    onClick?: ((e: React.MouseEvent<HTMLDivElement>) => void) | (() => void)
    onKeyDown?: ((e: React.KeyboardEvent<HTMLDivElement>) => void) | (() => void)
    role?: string
    tabIndex?: number
}) => {
    return (
        <div
            className={`${styles.container} ${iconPosition === 'opposite' ? styles.opposite : styles.together}` + (className ? ` ${className}` : '')}
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
