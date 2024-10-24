import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './Decoration.module.css'

import { useBattlefieldContext } from '@context/BattlefieldContext'
import { cn } from '@utils'

const Decoration = ({ square }: { square: string }) => {
    const { battlefield } = useBattlefieldContext()

    const { interactable, clicked, active } = useMemo(() => battlefield[square].flags, [battlefield, square])
    const [interactivityType, setInteractivityType] = useState('')

    useEffect(() => {
        if (interactable.flag) {
            setInteractivityType(() => {
                switch (interactable.type) {
                    case 'ally':
                        return `${styles.borderInCorner} ${styles.interactableAlly}`
                    case 'enemy':
                        return `${styles.borderInCorner} ${styles.interactableEnemy}`
                    default:
                        return ''
                }
            })
        } else {
            interactivityType !== '' ? setInteractivityType('') : null
        }
    }, [interactable])

    const getClickedNumberIcon = useCallback(() => {
        if (clicked <= 9 && clicked >= 0) {
            return '/assets/local/sel_sqr_' + clicked.toString() + '.svg'
        } else if (clicked > 9) {
            return '/assets/local/sel_sqr_9extnd.svg'
        }
        return null
    }, [clicked])

    return (
        <>
            <div className={cn(styles.decoration, interactivityType)} />
            {active ? (
                <img className={styles.activeEntity} src="/assets/local/active_entity.svg" alt="Active Entity Icon" />
            ) : null}
            {clicked ? (
                <>
                    <div className={cn(styles.decoration, styles.clickedEntityBorder)} />
                    {clicked > 1 ? (
                        <img
                            className={styles.clickedSquare}
                            src={getClickedNumberIcon() || '/assets/local/sel_sqr_1.svg'}
                            alt={`Clicked ${clicked} times icon`}
                        />
                    ) : null}
                </>
            ) : null}
        </>
    )
}

export default Decoration
