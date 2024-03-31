import { useCallback, useEffect, useState } from 'react'
import { REACT_APP_BACKEND_URL } from '../config/configs'
import axios from 'axios'
import AuthManager from '../services/AuthManager'

const LobbyPage = () => {
    const [lobbyInfo, setLobbyInfo] = useState({
        combats: [] as Array<{
            nickname: string
            isActive: boolean
            roundCount: number
        }>,
        players: [] as Array<{
            userId: string
            nickname: string
            mainCharacter: string
        }>,
        gm: '',
    })

    const lobbyId = window.location.pathname.split('/').pop()

    const refreshLobbyInfo = useCallback(async () => {
        let response
        try {
            response = await axios.get(`${REACT_APP_BACKEND_URL}/lobby/${lobbyId}`, {
                headers: AuthManager.authHeader(),
            })
        } catch (error) {
            console.log(error)
            return
        }
        console.log('Lobby info:', response.data)
        if (response && response.data && response.data.players && response.data.combats) {
            setLobbyInfo(response.data)
        }
    }, [lobbyId])

    useEffect(() => {
        refreshLobbyInfo().then()
    }, [])

    return (
        <div>
            <h1>Lobby Page</h1>
            <button
                onClick={refreshLobbyInfo}
            >
                Refresh Lobby Info
            </button>
            <div>
                <h2>Players</h2>
                {
                    lobbyInfo.players && lobbyInfo.players.length === 0 ?
                        <p>No players</p>
                        :
                        <ul>
                            {lobbyInfo.players.map((player) => (
                                <li key={player.userId}>
                                    {player.nickname} ({player.mainCharacter})
                                </li>
                            ))}
                        </ul>
                }
            </div>
            <div>
                <h2>Combats</h2>
                {
                    lobbyInfo.combats && lobbyInfo.combats.length === 0 ?
                        <p>No combats</p>
                        :
                        <ul>
                            {lobbyInfo.combats.map((combat) => (
                                <li key={combat.nickname}>
                                    {combat.nickname} ({combat.isActive ? 'Active' : 'Inactive'}, {combat.roundCount} rounds)
                                </li>
                            ))}
                        </ul>
                }
            </div>
        </div>
    )
}

export default LobbyPage
