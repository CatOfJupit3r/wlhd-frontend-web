import Footer from '@components/Footer'
import Header from '@components/Header'
import Notify from '@components/Notify'
import { setLobbyInfo } from '@redux/slices/lobbySlice'
import APIService from '@services/APIService'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { refreshLobbyInfo, refreshUserInfo } from '@utils/refreshers'
import useIsLoggedIn from '@hooks/useIsLoggedIn'

const LobbyPagesLayout = ({ includeHeader, includeFooter }: { includeHeader?: boolean; includeFooter?: boolean }) => {
    const { lobbyId } = useParams()
    const isLoggedIn = useIsLoggedIn()

    useEffect(() => {
        refreshLobbyInfo(lobbyId).then()
    }, [lobbyId])

    useEffect(() => {
        console.log("isLoggedIn", isLoggedIn)
        if (!isLoggedIn) {
            return
        }
        refreshUserInfo()
    }, [isLoggedIn])

    return (
        <>
            {includeHeader && <Header />}
            <Notify />
            <main>
                <Outlet />
            </main>
            {includeFooter && <Footer />}
        </>
    )
}

export default LobbyPagesLayout
