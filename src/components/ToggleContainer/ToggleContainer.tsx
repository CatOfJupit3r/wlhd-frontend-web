import ElementWithIcon from '@components/ElementWithIcon'
import React, { ReactNode, useCallback, useState } from 'react'
import { RiArrowDownDoubleFill } from 'react-icons/ri'
import styles from './ToggleContainer.module.css'

const ToggleContainer = ({
    children,
    header,
    className,
}: {
    header: JSX.Element
    children: ReactNode
    className?: string
}) => {
    const [showItems, setShowItems] = useState(false)

    const ToggleMouse = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault()
            setShowItems(!showItems)
        },
        [showItems]
    )

    const ToggleKey = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                e.preventDefault()
                setShowItems(!showItems)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setShowItems(false)
            } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setShowItems(true)
            }
        },
        [showItems]
    )

    const getIconClassName = useCallback(() => {
        return showItems ? styles.iconOpen : styles.iconClosed
    }, [showItems])

    return (
        <div className={`${styles.toggleContainer}` + (className ? ` ${className}` : '')}>
            <ElementWithIcon
                iconPosition={'opposite'}
                element={header}
                icon={<RiArrowDownDoubleFill className={getIconClassName()} />}
                onClick={ToggleMouse}
                onKeyDown={ToggleKey}
                role="button"
                tabIndex={0}
                className={styles.toggleSwitch}
            />
            {showItems && <div className={styles.toggleContainer}>{children}</div>}
        </div>
    )
}

export default ToggleContainer
