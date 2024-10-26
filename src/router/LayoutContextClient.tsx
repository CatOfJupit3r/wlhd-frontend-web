import { TooltipProvider } from '@components/ui/tooltip'
import { CoordinatorEntitiesProvider } from '@context/CoordinatorEntitiesProvider'
import { GameDataProvider } from '@context/GameDataProvider'
import { useLayoutContext } from '@context/LayoutContext'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import paths from '@router/paths'
import { apprf, cn, refreshLobbyInfo, refreshUserInfo } from '@utils'
import { lazy, ReactNode, startTransition, Suspense, useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'

const Header = lazy(() => import('@components/Header'))
const Footer = lazy(() => import('@components/Footer'))
const Notify = lazy(() => import('@components/Notify'))

const HeaderPlaceholder = () => (
    <div
        className={cn(
            'relative top-0 flex w-full justify-between bg-black p-4 text-t-normal text-white',
            apprf('max-[512px]', 'flex-col justify-center gap-3 bg-black p-4 text-center align-middle')
        )}
    >
        Loading header...
    </div>
)

const FooterPlaceholder = () => (
    <footer className={'relative bottom-0 box-border block min-h-fit w-full justify-center bg-[#252525FF] p-8'}>
        <h1 className={'text-center text-t-normal font-bold text-[#d5d5d5]'}>
            By player, for players... and developers too!
        </h1>
        <div
            id={'footer-links'}
            className={cn(
                'mt-[1%] flex justify-center gap-[1%] text-t-small',
                apprf('max-[512px]', 'flex flex-col items-center justify-center gap-2')
            )}
        >
            <div>Loading footer...</div>
        </div>
    </footer>
)

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
                <Suspense fallback={<HeaderPlaceholder />}>
                    <Header />
                </Suspense>
            )}
            <main>
                <RouteProtection>
                    <Outlet />
                </RouteProtection>
            </main>
            {footer && (
                <Suspense fallback={<FooterPlaceholder />}>
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
        <TooltipProvider>
            <CoordinatorEntitiesProvider>
                <GameDataProvider>{children}</GameDataProvider>
            </CoordinatorEntitiesProvider>
        </TooltipProvider>
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
