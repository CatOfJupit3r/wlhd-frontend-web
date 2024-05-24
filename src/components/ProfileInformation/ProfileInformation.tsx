import {useCallback, useEffect, useState} from 'react'
import APIService from '../../services/APIService'
import LobbyRedirect from './LobbyRedirect/LobbyRedirect'
import styles from './ProfileInformation.module.css'

const ProfileInformation = () => {
    const [joinedLobbies, setJoinedLobbies] = useState(
        [] as Array<{
            name: string
            isGm: boolean
            _id: string
        }>
    )

    const [userInfo, setUserInfo] = useState({
        handle: '',
        createdAt: '',
    } as {
        handle: string
        createdAt: string
    })

    const getMyLobbies = useCallback(async () => {
        const myLobbies = await APIService.getMyLobbies()
        setJoinedLobbies(myLobbies)
    }, [])

    const getUserInformation = useCallback(async () => {
        const userInfo = await APIService.getUserInformation()
        setUserInfo(userInfo)
    }, [])

    useEffect(() => {
        getMyLobbies().catch((error) => {
            console.log(error)
        })
        getUserInformation().catch((error) => {
            console.log(error)
        })
    }, [])

    const JoinedLobbies = useCallback(() => {
        return (
            <>
                {joinedLobbies &&
                    joinedLobbies.map(
                        (
                            lobby: {
                                name: string
                                isGm: boolean
                                _id: string
                            },
                            index
                        ) => <LobbyRedirect info={lobby} key={index} />
                    )}
            </>
        )
    }, [joinedLobbies])

    return (
        <div className={styles.profileContainer}>
            <h1>Welcome back {userInfo.handle}!</h1>
            <h3>Joined lobbies:</h3>
            <div className={styles.joinedLobbiesContainer}>
                <JoinedLobbies />
            </div>
            <h5>You are with us since {new Date(userInfo.createdAt).toLocaleDateString()}! 🎉</h5>
        </div>
    )
}

export default ProfileInformation
