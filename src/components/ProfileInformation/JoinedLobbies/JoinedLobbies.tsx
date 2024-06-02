import LobbyInfo from '../LobbyInfo/LobbyInfo'
import styles from './JoinedLobbies.module.css'

const JoinedLobbies = ({ joined, className }: { joined: Array<string>; className?: string }) => {
    return (
        <div className={styles.joinedLobbiesContainer.concat(className ? ` ${className}` : '')}>
            <h1>Joined</h1>
            <div className={styles.lobbyList}>
                {joined && joined.map((lobbyId: string, index) => <LobbyInfo lobbyId={lobbyId} key={index} />)}
            </div>
        </div>
    )
}

export default JoinedLobbies
