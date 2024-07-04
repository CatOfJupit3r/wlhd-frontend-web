import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import Footer from '@components/Footer/Footer'
import Header from '@components/Header/Header'
import Notify from '@components/Notify'
import { setLobbyInfo } from '@redux/slices/lobbySlice'
import APIService from '@services/APIService'

const LobbyPagesLayout = ({ includeHeader, includeFooter }: { includeHeader?: boolean; includeFooter?: boolean }) => {
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
        if (response && response.players && response.combats) {
            dispatch(setLobbyInfo(response))
        }
    }, [dispatch, lobbyId])

    useEffect(() => {
        refreshLobbyInfo().then()
    }, [lobbyId])

    return (
        <>
            {includeHeader && <Header includeLobbyRoute={true} />}
            <Notify />
            <main>
                <Outlet />
            </main>
            {includeFooter && <Footer />}
        </>
    )
}

export default LobbyPagesLayout
