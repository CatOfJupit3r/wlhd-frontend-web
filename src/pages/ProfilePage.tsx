import React, { useEffect, useState } from 'react'
import AuthManager from '../services/AuthManager'
import { REACT_APP_BACKEND_URL } from '../config/configs'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProfilePage = () => {
    const navigate = useNavigate()

    const [joinedLobbies, setJoinedLobbies] = useState([])



    useEffect(() => {
        try {
            axios.get(`${REACT_APP_BACKEND_URL}/user/joined_lobbies`, {
                headers: AuthManager.authHeader()
            })
                .then((res) => res.data)
                .catch((error) => {
                    console.log(error)
                    navigate('..')
                    return
                })
                .then((data) => {
                    setJoinedLobbies(data)
                })
        }
        catch (error) {
            console.log(error)
            navigate('..')
        }
    }, [])

    return (
        <div>
            <h1>Profile Page</h1>
            <h3>Joined lobbies:</h3>
            {
                joinedLobbies && joinedLobbies.length
                    ?
                    <>
                        {joinedLobbies && joinedLobbies.map((lobby: { name: string; isGm: boolean, _id: string }, index) => (
                            <Link key={index} to={`./lobby/${lobby._id}`}>
                                {lobby.name} - {lobby.isGm ? 'GM' : 'Player'}
                            </Link>
                        ))}
                    </>
                    :
                    <h4>No joined lobbies</h4>
            }
        </div>
    )
}

export default ProfilePage