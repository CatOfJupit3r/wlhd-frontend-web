import Footer from '@components/Footer'
import Header from '@components/Header'
import Notify from '@components/Notify'
import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { refreshLobbyInfo, refreshUserInfo } from '@utils'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { CoordinatorEntitiesProvider } from '@components/ContextProviders/CoordinatorEntitiesProvider'

const LobbyPagesLayout = ({ includeHeader, includeFooter }: { includeHeader?: boolean; includeFooter?: boolean }) => {
    const { lobbyId } = useParams()
    const isLoggedIn = useIsLoggedIn()

    useEffect(() => {
        refreshLobbyInfo(lobbyId).then()
    }, [lobbyId])

    useEffect(() => {
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
                <CoordinatorEntitiesProvider>
                    <Outlet />
                </CoordinatorEntitiesProvider>
            </main>
            {includeFooter && <Footer />}
        </>
    )
}

export default LobbyPagesLayout
