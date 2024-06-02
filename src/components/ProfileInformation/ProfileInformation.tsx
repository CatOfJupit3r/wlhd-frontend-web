import { useCallback, useEffect, useState } from 'react'
import { ShortLobbyInformation, UserInformation } from '../../models/APIData'
import APIService from '../../services/APIService'
import JoinedLobbies from './JoinedLobbies/JoinedLobbies'
import styles from './ProfileInformation.module.css'
import joinedLobbies from './JoinedLobbies/JoinedLobbies'

const ProfileInformation = () => {
    const [{ handle, createdAt, joined }, setUserInfo] = useState({
        handle: '',
        createdAt: '',
        joined: []
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
            <JoinedLobbies joined={joined} className={styles.lobbies} />
        </div>
    )
}

export default ProfileInformation
