import { useCallback, useEffect, useState } from 'react'
import { UserInformation } from '../../models/APIData'
import APIService from '../../services/APIService'
import styles from './ProfileInformation.module.css'
import LobbyShortInfo from './LobbyShortInfo/LobbyShortInfo'

const ProfileInformation = () => {
    const [{ handle, createdAt, joined }, setUserInfo] = useState({
        handle: '',
        createdAt: '',
        joined: [],
    } as UserInformation)

    const getUserInformation = useCallback(async () => {
        const userInfo = await APIService.getUserInformation()
        setUserInfo(userInfo)
    }, [])

    useEffect(() => {
        getUserInformation().catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <div className={styles.profileContainer}>
            <div className={styles.info}>
                <img src={'https://placehold.co/260x260'} alt="User Avatar" />
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
