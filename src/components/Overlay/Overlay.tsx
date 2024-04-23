import React from 'react'
import styles from './Overlay.module.css'

const Overlay = ({ row, children }: { row?: boolean; children?: React.ReactNode }) => {
    return (
        <div className={styles.overlay} id={'overlay-screen'}>
            <div id={'info'} className={`${styles.container} ${row ? styles.flexRow : styles.flexColumn}`}>
                {children}
            </div>
        </div>
    )
}

export default Overlay
