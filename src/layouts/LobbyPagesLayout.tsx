import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import Header from '../components/Header/Header'
import Notify from '../components/Notify'
import { setLobbyInfo } from '../redux/slices/lobbySlice'
import APIService from '../services/APIService'

const LobbyPagesLayout = () => {
    const { lobbyId } = useParams()
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
            dispatch(setLobbyInfo(response))
        }
    }, [dispatch, lobbyId])

    useEffect(() => {
        refreshLobbyInfo().then()
    }, [lobbyId])

    return (
        <>
            <Header />
            <Notify />
            <Outlet />
        </>
    )
}

export default LobbyPagesLayout
