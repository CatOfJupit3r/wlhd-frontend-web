import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import APIService from '../services/APIService'

const ProfilePage = () => {
    const [joinedLobbies, setJoinedLobbies] = useState(
        [] as Array<{
            name: string
            isGm: boolean
            _id: string
        }>
    )

    const getMyLobbies = async () => {
        const myLobbies = await APIService.getMyLobbies()
        setJoinedLobbies(myLobbies)
    }

    useEffect(() => {
        getMyLobbies()
            .then()
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <div>
            <h1>Welcome back!</h1>
            <h3>Joined lobbies:</h3>
            {joinedLobbies && joinedLobbies.length ? (
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
                            ) => (
                                <div key={index}>
                                    <Link to={`../lobby-room/${lobby._id}`}>
                                        {lobby.name} - {lobby.isGm ? 'GM' : 'Player'}
                                    </Link>
                                    <br />
                                </div>
                            )
                        )}
                </>
            ) : (
                <h4>No joined lobbies</h4>
            )}
        </div>
    )
}

export default ProfilePage
