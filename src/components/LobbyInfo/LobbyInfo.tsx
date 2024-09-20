import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { useSelector } from 'react-redux'
import CombatInfo from './CombatInfo/CombatInfo'
import styles from './LobbyInfo.module.css'
import PlayerInfo from './PlayerInfo/PlayerInfo'

const LobbyInfo = () => {
    const { name } = useSelector(selectLobbyInfo)

    return (
        <div className={styles.lobbyInfoContainer}>
            <div className={styles.mainSection}>
                <h1 className={`${styles.lobbyName} border-container-biggest`}>{name}</h1>
                <CombatInfo />
            </div>
            <PlayerInfo className={styles.playerSection} />
        </div>
    )
}

export default LobbyInfo
