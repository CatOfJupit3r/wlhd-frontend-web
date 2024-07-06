import LobbyShortInfo from './LobbyShortInfo'
import styles from './ProfileInformation.module.css'
import { selectUserInformation } from '@redux/slices/cosmeticsSlice'
import { useSelector } from 'react-redux'

const ProfileInformation = () => {
    const { avatar, handle, joined, createdAt } = useSelector(selectUserInformation)

    return (
        <div className={styles.profileContainer}>
            <div className={styles.info}>
                <img src={avatar} alt="User Avatar" />
                <h1>{'@'.concat(handle)}</h1>
                <div>
                    <h5>You are with us since {new Date(createdAt).toLocaleDateString()}! 🎉</h5>
                </div>
            </div>
            <div className={`${styles.joinedLobbiesContainer}`}>
                <h1>Joined</h1>
                <div className={styles.lobbyList}>
                    {joined && joined.map((lobbyId: string, index) => <LobbyShortInfo lobbyId={lobbyId} key={index} />)}
                </div>
            </div>
        </div>
    )
}

export default ProfileInformation
