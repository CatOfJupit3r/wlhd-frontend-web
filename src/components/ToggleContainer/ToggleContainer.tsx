import React, { ReactNode, useCallback, useState } from 'react'
import ElementWithIcon from '../ElementWithIcon/ElementWithIcon'
import styles from './ToggleContainer.module.css'
import { RiArrowDownDoubleFill } from 'react-icons/ri'

const ToggleContainer = ({ children, header }: { header: JSX.Element; children: ReactNode }) => {
    const [showItems, setShowItems] = useState(false)

    const Toggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault()
        setShowItems(!showItems)
    }

    const getIconClassName = useCallback(() => {
        return showItems ? styles.iconOpen : styles.iconClosed
    }, [showItems])

    return (
        <div className={styles.container} onClick={Toggle} onKeyDown={Toggle} role="button" tabIndex={0}>
            <ElementWithIcon element={header} icon={<RiArrowDownDoubleFill className={getIconClassName()} />} />
            {showItems && <div className={styles.toggleContainer}>{children}</div>}
        </div>
    )
}

export default ToggleContainer
