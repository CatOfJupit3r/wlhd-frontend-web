import { useCallback, useEffect, useState } from 'react'
import styles from './Decoration.module.css'

export interface DecorationConfig {
    interactable: {
        flag: boolean
        type: 'ally' | 'enemy' | 'neutral'
    } // refers to square if it can be clicked
    clicked: {
        flag: boolean // refers to square if it was clicked
        times: number // refers to how many times it was clicked
    } // refers to square if it was clicked
    active: boolean // refers to entity on square
}

const Decoration = ({ decoration }: { decoration: DecorationConfig }) => {
    const { interactable, clicked, active } = decoration

    const [interactivityType, setInteractivityType] = useState('')

    useEffect(() => {
        if (interactable.flag) {
            setInteractivityType(() => {
                switch (interactable.type) {
                    case 'ally':
                        return styles.interactableAlly
                    case 'enemy':
                        return styles.interactableEnemy
                    default:
                        return ''
                }
            })
        } else {
            interactivityType !== '' ? setInteractivityType('') : null
        }
    }, [interactable.flag, interactable.type])

    const getClickedNumberIcon = useCallback(() => {
        if (clicked.times <= 9 && clicked.times >= 0) {
            return '/assets/local/sel_sqr_' + clicked.times.toString() + '.svg'
        } else if (clicked.times > 9) {
            return '/assets/local/sel_sqr_9extnd.svg'
        }
        return null
    }, [clicked.times])

    useEffect(() => {
        if (active) {
            console.log('Active entity on square')
        }
    }, [])

    return (
        <>
            <div className={`${styles.decoration} ${interactivityType} `} />
            {active ? (
                <img className={styles.activeEntity} src="/assets/local/active_entity.svg" alt="Active Entity Icon" />
            ) : null}
            {clicked.flag ? (
                <img
                    className={styles.clickedSquare}
                    src={getClickedNumberIcon() || '/assets/local/sel_sqr_1.svg'}
                    alt={`Clicked ${clicked.times} times icon`}
                />
            ) : null}
        </>
    )
}

export default Decoration
