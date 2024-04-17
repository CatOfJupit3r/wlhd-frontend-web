import React, { useEffect, useState } from 'react'
import AuthManager from '../services/AuthManager'
import { REACT_APP_BACKEND_URL } from '../config/configs'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import APIService from '../services/APIService'

const ProfilePage = () => {
    const navigate = useNavigate()

    const [joinedLobbies, setJoinedLobbies] = useState([] as Array<{
        name: string
        isGm: boolean
        _id: string
    }>)

    const getMyLobbies = async () => {
        const myLobbies = await APIService.getMyLobbies()
        setJoinedLobbies(myLobbies)
    }

    useEffect(() => {
        getMyLobbies().then().catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <div>
            <h1>Profile Page</h1>
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
                                    <br/>
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
