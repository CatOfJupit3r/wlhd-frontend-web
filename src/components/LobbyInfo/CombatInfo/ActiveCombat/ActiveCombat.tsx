import { Link } from 'react-router-dom'
import { CombatInfo } from '../../../../redux/slices/lobbySlice'
import paths from '../../../../router/paths'
import styles from './ActiveCombat.module.css'

const ActiveCombat = ({ combat, lobbyId }: { combat: CombatInfo; lobbyId: string }) => {
    return (
        <Link
            key={combat.nickname}
            to={paths.gameRoom.replace(':lobbyId', lobbyId || '').replace(':gameId', combat._id)}
            className={styles.crutch}
        >
            {combat.nickname} ({combat.isActive ? 'Active' : 'Inactive'}, {combat.roundCount} rounds)
        </Link>
    )
}

export default ActiveCombat
