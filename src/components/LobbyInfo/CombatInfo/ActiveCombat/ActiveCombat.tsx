import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CombatInfo } from '../../../../models/Redux'
import styles from './ActiveCombat.module.css'

const ActiveCombat = ({ combat, link }: { combat: CombatInfo; link: string }) => {
    const combatIsActive = useMemo(() => (combat.isActive ? 'active' : 'inactive'), [combat.isActive])

    return (
        <div>
            {combat.nickname} ({combatIsActive}, {combat.roundCount} rounds)
            <Link key={combat.nickname} to={link} className={styles.crutch}>
            </Link>
        </div>
    )
}

export default ActiveCombat
