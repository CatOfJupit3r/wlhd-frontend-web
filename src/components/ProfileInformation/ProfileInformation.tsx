import { useCallback, useEffect, useState } from 'react'
import { LobbyInformation, UserInformation } from '../../models/APIData'
import APIService from '../../services/APIService'
import JoinedLobbies from './JoinedLobbies/JoinedLobbies'
import styles from './ProfileInformation.module.css'

const ProfileInformation = () => {
    const [joinedLobbies, setJoinedLobbies] = useState([] as Array<LobbyInformation>)

    const [{ handle, createdAt }, setUserInfo] = useState({
        handle: '',
        createdAt: '',
    } as UserInformation)

    const getUserInformation = useCallback(async () => {
        const userInfo = await APIService.getUserInformation()
        setUserInfo(userInfo)
    }, [])

    const getMyLobbies = useCallback(async () => {
        const myLobbies = await APIService.getMyLobbies()
        setJoinedLobbies(myLobbies)
    }, [])

    useEffect(() => {
        getUserInformation().catch((error) => {
            console.log(error)
        })
        getMyLobbies().catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <div className={styles.profileContainer}>
            <div className={styles.infoSection}>
                <img src={'https://placehold.co/260x260'} alt="User Avatar" className={styles.avatar}/>
                <h1 className={styles.handle}>{'@'.concat(handle)}</h1>
                <div className={styles.bio}>
                    <h5>You are with us since {new Date(createdAt).toLocaleDateString()}! 🎉</h5>
                </div>
            </div>
            <JoinedLobbies joinedLobbies={joinedLobbies} className={styles.lobbies} />
        </div>
    )
}

export default ProfileInformation
