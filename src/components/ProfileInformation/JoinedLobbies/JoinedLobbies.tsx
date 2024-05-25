import { LobbyInformation } from '../../../models/APIData'
import LobbyRedirect from '../LobbyRedirect/LobbyRedirect'
import styles from './JoinedLobbies.module.css'

const JoinedLobbies = ({ joinedLobbies, className }: { joinedLobbies: Array<LobbyInformation>; className?: string }) => {
    return (
        <div className={styles.joinedLobbiesContainer.concat(className ? ` ${className}` : '')}>
            {joinedLobbies &&
                joinedLobbies.map((lobby: LobbyInformation, index) => <LobbyRedirect info={lobby} key={index} />)}
        </div>
    )
}

export default JoinedLobbies
