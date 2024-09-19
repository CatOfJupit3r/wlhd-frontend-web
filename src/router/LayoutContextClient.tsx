import { CoordinatorEntitiesProvider } from '@context/CoordinatorEntitiesProvider'
import { GameDataProvider } from '@context/GameDataProvider'
import { useLayoutContext } from '@context/LayoutContext'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import paths from '@router/paths'
import { refreshLobbyInfo, refreshUserInfo } from '@utils'
import { lazy, ReactNode, startTransition, Suspense, useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'

const Header = lazy(() => import('@components/Header'))
const Footer = lazy(() => import('@components/Footer'))
const Notify = lazy(() => import('@components/Notify'))

const LayoutContextClient = () => {
    const { lobbyId } = useParams()
    const { footer, header, lobbyInfo } = useLayoutContext()
    const isLoggedIn = useIsLoggedIn()

    useEffect(() => {
        if (isLoggedIn) {
            startTransition(() => {
                refreshUserInfo()
            })
        }
    }, [isLoggedIn])

    useEffect(() => {
        if (lobbyInfo && lobbyId) {
            startTransition(() => {
                refreshLobbyInfo(lobbyId).then()
            })
        }
    }, [lobbyInfo, lobbyId])

    return (
        <GlobalContext>
            {header && (
                <Suspense fallback={<div>Loading header...</div>}>
                    <Header />
                </Suspense>
            )}
            <main>
                <RouteProtection>
                    <Outlet />
                </RouteProtection>
            </main>
            {footer && (
                <Suspense fallback={<div>Loading footer...</div>}>
                    <Footer />
                </Suspense>
            )}
            <Suspense fallback={null}>
                <Notify />
            </Suspense>
        </GlobalContext>
    )
}

const GlobalContext = ({ children }: { children: ReactNode }) => {
    return (
        <CoordinatorEntitiesProvider>
            <GameDataProvider>{children}</GameDataProvider>
        </CoordinatorEntitiesProvider>
    )
}

const RouteProtection = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn } = useIsLoggedIn()
    const { auth } = useLayoutContext()

    if (!auth) {
        return <>{children}</>
    } else {
        if (!isLoggedIn) {
            return <Navigate to={paths.signIn} replace />
        } else {
            return <>{children}</>
        }
    }
}

export default LayoutContextClient
