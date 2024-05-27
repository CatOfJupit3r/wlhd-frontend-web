import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectLobbyInfo } from '../../../redux/slices/lobbySlice'
import paths from '../../../router/paths'
import ActiveCombat from './ActiveCombat/ActiveCombat'
import styles from './CombatInfo.module.css'

const CombatInfo = () => {
    const { combats, lobbyId, layout } = useSelector(selectLobbyInfo)

    const CreateNewCombat = useCallback(() => {
        return (
            <Link to={paths.createCombatRoom.replace(':lobbyId', lobbyId || '')}>
                <button>Create new combat!</button>
            </Link>
        )
    }, [lobbyId])

    return (
        <div className={styles.crutch}>
            <h2>Combats</h2>
            {layout === 'gm' && <CreateNewCombat />}
            {combats && combats.length === 0 ? (
                <p>No combats</p>
            ) : (
                <>
                    {combats.map((combat, index) => (
                        <ActiveCombat combat={combat} lobbyId={lobbyId} key={index} />
                    ))}
                </>
            )}
        </div>
    )
}

export default CombatInfo
