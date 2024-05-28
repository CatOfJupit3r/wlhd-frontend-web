import styles from './LobbyInfo.module.css'
import PlayerInfo from './PlayerInfo/PlayerInfo'
import CombatInfo from './CombatInfo/CombatInfo'
import { selectLobbyInfo } from '../../redux/slices/lobbySlice'
import { useSelector } from 'react-redux'

const LobbyInfo = () => {
    const { name } = useSelector(selectLobbyInfo)
    return (
        <div className={styles.lobbyInfoContainer}>
            <div className={styles.mainSection}>
                <h1 className={styles.lobbyName}>{name}</h1>
                <CombatInfo />
            </div>
            <PlayerInfo className={styles.playerSection} />
        </div>
    )
}

export default LobbyInfo