import { LobbyInformation } from '../../../models/APIData'
import LobbyRedirect from '../LobbyRedirect/LobbyRedirect'
import styles from './JoinedLobbies.module.css'

const JoinedLobbies = ({ joinedLobbies, className }: { joinedLobbies: Array<LobbyInformation>; className?: string }) => {
    return (
        <div className={styles.joinedLobbiesContainer.concat(className ? ` ${className}` : '')}>
            <h1>Joined</h1>
            <div className={styles.lobbyList}>
                {joinedLobbies &&
                    joinedLobbies.map((lobby: LobbyInformation, index) => <LobbyRedirect info={lobby} key={index} />)}
            </div>
        </div>
    )
}

export default JoinedLobbies
