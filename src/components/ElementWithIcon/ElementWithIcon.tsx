import React from 'react'
import styles from './ElementWithIcon.module.css'

const ElementWithIcon = ({
    icon,
    element,
    iconPosition = 'together',
}: {
    icon: JSX.Element
    element: JSX.Element
    iconPosition?: 'together' | 'opposite'
}) => {
    return (
        <div className={`${styles.container} ${iconPosition === 'opposite' ? styles.opposite : styles.together}`}>
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
