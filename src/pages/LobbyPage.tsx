import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import paths from '../router/paths'
import APIService from '../services/APIService'
import { useDispatch, useSelector } from 'react-redux'
import { selectLobbyInfo, setLobbyInfo } from '../redux/slices/lobbySlice'

const LobbyPage = () => {
    const lobbyInfo = useSelector(selectLobbyInfo)
    const lobbyId = window.location.pathname.split('/').pop()
    const dispatch = useDispatch()

    const refreshLobbyInfo = useCallback(async () => {
        let response
        try {
            response = await APIService.getLobbyInfo(lobbyId || '')
        } catch (error) {
            console.log(error)
            return
        }
        console.log('Lobby info:', response)
        if (response && response.players && response.combats) {
            dispatch(setLobbyInfo(response as any))
        }
    }, [lobbyId])

    useEffect(() => {
        refreshLobbyInfo().then()
    }, [])

    return (
        <div>
            <h1>Lobby Page</h1>
            <button onClick={refreshLobbyInfo}>Refresh Lobby Info</button>
            <div>
                <h2>Players</h2>
                {lobbyInfo.players && lobbyInfo.players.length === 0 ? (
                    <p>No players</p>
                ) : (
                    <ul>
                        {lobbyInfo.players.map((player) => (
                            <li key={player.userId}>
                                {player.nickname} ({player.mainCharacter})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <h2>Your character</h2>
                {lobbyInfo.controlledEntity ? (
                    <>
                        <h3>{lobbyInfo.controlledEntity.id}</h3>
                        <Link to={paths.viewCharacter.replace(':lobbyId', lobbyId || '')}>
                            Controlled entity
                        </Link>
                    </>
                ) : (
                    <p>No controlled entity</p>
                )}
            </div>
            <div>
                <h2>Combats</h2>
                {lobbyInfo.combats && lobbyInfo.combats.length === 0 ? (
                    <p>No combats</p>
                ) : (
                    <ul>
                        {lobbyInfo.combats.map((combat) => (
                            <li key={combat.nickname}>
                                {combat.nickname} ({combat.isActive ? 'Active' : 'Inactive'}, {combat.roundCount}{' '}
                                rounds)
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {lobbyInfo.layout === 'gm' && (
                <>
                    <Link to={paths.createCombatRoom.replace(':lobbyId', lobbyId || '')}>
                        <button>Create new combat!</button>
                    </Link>
                </>
            )}
        </div>
    )
}

export default LobbyPage
