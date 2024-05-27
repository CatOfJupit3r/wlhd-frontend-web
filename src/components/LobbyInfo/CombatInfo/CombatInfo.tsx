import styles from './CombatInfo.module.css'
import {selectLobbyInfo} from "../../../redux/slices/lobbySlice";
import {useSelector} from "react-redux";
import paths from "../../../router/paths";
import {Link} from "react-router-dom";

const CombatInfo = () => {
    const { combats, lobbyId, layout } = useSelector(selectLobbyInfo)
    
    
    return (
        <div className={styles.crutch}>
            <h2>Combats</h2>
            {combats && combats.length === 0 ? (
                <p>No combats</p>
            ) : (
                <ul>
                    {combats.map((combat) => (
                        <Link
                            key={combat.nickname}
                            to={paths.gameRoom
                                .replace(':lobbyId', lobbyId || '')
                                .replace(':gameId', combat._id)}
                        >
                            {combat.nickname} ({combat.isActive ? 'Active' : 'Inactive'}, {combat.roundCount} rounds)
                        </Link>
                    ))}
                </ul>
            )}
            {layout === 'gm' && (
                <>
                    <Link to={paths.createCombatRoom.replace(':lobbyId', lobbyId || '')}>
                        <button>Create new combat!</button>
                    </Link>
                </>
            )}
        </div>
    )
}

export default CombatInfo
