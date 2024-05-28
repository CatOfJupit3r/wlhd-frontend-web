import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectLobbyInfo } from '../../../redux/slices/lobbySlice'
import paths from '../../../router/paths'
import ElementWithIcon from '../../ElementWithIcon/ElementWithIcon'
import ActiveCombat from './ActiveCombat/ActiveCombat'
import styles from './CombatInfo.module.css'
import { LuPlus } from 'react-icons/lu'

const CombatInfo = () => {
    const { combats, lobbyId, layout } = useSelector(selectLobbyInfo)

    const CreateNewCombat = useCallback(() => {
        return (
            <Link to={paths.createCombatRoom.replace(':lobbyId', lobbyId || '')} className={styles.createNewCombat}>
                <ElementWithIcon icon={<LuPlus style={{ color: 'black' }} />} element={<p>Create new combat</p>} />
            </Link>
        )
    }, [lobbyId])

    const getLink = useCallback((combatId: string) => {
        return paths.gameRoom.replace(':lobbyId', lobbyId || '').replace(':gameId', combatId)
    }, [lobbyId])

    return (
        <div className={styles.combatInfoContainer}>
            <h1>Combats</h1>
            {layout === 'gm' && <CreateNewCombat />}
            <div className={styles.combatContainer}>
                {combats && combats.length === 0 ? (
                    <p>No combats</p>
                ) : (
                    <>
                        {combats.map((combat, index) => (
                            <ActiveCombat
                                combat={combat}
                                link={getLink(combat._id)}
                                key={index}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default CombatInfo
