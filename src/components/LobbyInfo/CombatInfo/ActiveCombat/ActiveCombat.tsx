import { useMemo } from 'react'
import { FaCircle } from 'react-icons/fa6'
import { IoEnterOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { CombatInfo } from '../../../../models/Redux'
import ElementWithIcon from '../../../ElementWithIcon/ElementWithIcon'
import styles from './ActiveCombat.module.css'

const ActiveCombat = ({ combat, link }: { combat: CombatInfo; link: string }) => {
    const combatIsActive = useMemo(() => (combat.isActive ? 'active' : 'inactive'), [combat.isActive])

    return (
        <div className={styles.activeCombat}>
            <div className={styles.combatStateContainer}>
                <ElementWithIcon
                    icon={
                        <FaCircle
                            className={styles.circle}
                            style={{
                                color: combatIsActive === 'active' ? 'lightgreen' : 'gray',
                                position: 'relative',
                            }}
                        />
                    }
                    element={
                        <p>
                            {combat.nickname} ({combat.roundCount} rounds)
                        </p>
                    }
                />
                <Link key={combat.nickname} to={link}>
                    <ElementWithIcon icon={<IoEnterOutline />} element={<p>Enter</p>} />
                </Link>
            </div>
            <div className={styles.joinedPlayerContainer}>
                {combat.activePlayers?.length !== 0 ? combat.activePlayers.map((player, index) => (
                    <p key={index}>
                        {player.nickname} (@{player.handle})
                    </p>
                )) : <p>
                    No players
                </p>}
            </div>
        </div>
    )
}

export default ActiveCombat
