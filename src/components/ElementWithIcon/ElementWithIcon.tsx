import React from 'react'
import styles from './ElementWithIcon.module.css'

const ElementWithIcon = ({
    icon,
    element,
}: {
    icon: JSX.Element
    element: JSX.Element
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>) => void
}) => {
    return (
        <div className={styles.container}>
            {icon}
            {element}
        </div>
    )
}

export default ElementWithIcon
