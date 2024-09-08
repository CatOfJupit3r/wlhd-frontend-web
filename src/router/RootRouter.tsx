import { CoordinatorEntitiesProvider } from '@context/CoordinatorEntitiesProvider'
import { GameDataProvider } from '@context/GameDataProvider'
import useIsBackendUnavailable from '@hooks/useIsBackendUnavailable'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { RouteConfig } from '@models/RouteConfig'
import { PageWrapper } from '@pages/PageWrapper'
import { refreshLobbyInfo, refreshUserInfo } from '@utils'
import { lazy, ReactNode, Suspense, useEffect } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useParams } from 'react-router-dom'
import paths from './paths'
import routes from './routes'

const Header = lazy(() => import('@components/Header'))
const Footer = lazy(() => import('@components/Footer'))
const Notify = lazy(() => import('@components/Notify'))
const UnderMaintenancePage = lazy(() => import('@pages/UnderMaintenancePage'))
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'))
const PseudoPage = lazy(() => import('@pages/PseudoPage'))

const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
    return (
        <CoordinatorEntitiesProvider>
            <GameDataProvider>{children}</GameDataProvider>
        </CoordinatorEntitiesProvider>
    )
}

const MainLayout = ({ includeHeader, includeFooter }: { includeHeader?: boolean; includeFooter?: boolean }) => {
    const isLoggedIn = useIsLoggedIn()

    useEffect(() => {
        if (isLoggedIn) {
            refreshUserInfo()
        }
    }, [isLoggedIn])

    return (
        <AuthenticatedLayout>
            {includeHeader && (
                <Suspense fallback={<div>Loading header...</div>}>
                    <Header />
                </Suspense>
            )}
            <main>
                <Outlet />
            </main>
            {includeFooter && (
                <Suspense fallback={<div>Loading footer...</div>}>
                    <Footer />
                </Suspense>
            )}
            <Suspense fallback={null}>
                <Notify />
            </Suspense>
        </AuthenticatedLayout>
    )
}

const LobbyLayout = ({ includeHeader, includeFooter }: { includeHeader?: boolean; includeFooter?: boolean }) => {
    const { lobbyId } = useParams()
    const isLoggedIn = useIsLoggedIn()

    useEffect(() => {
        if (isLoggedIn) {
            refreshUserInfo()
        }
    }, [isLoggedIn])

    useEffect(() => {
        refreshLobbyInfo(lobbyId).then()
    }, [lobbyId])

    return (
        <AuthenticatedLayout>
            {includeHeader && (
                <Suspense fallback={<div>Loading header...</div>}>
                    <Header />
                </Suspense>
            )}
            <main>
                <Outlet />
            </main>
            {includeFooter && (
                <Suspense fallback={<div>Loading footer...</div>}>
                    <Footer />
                </Suspense>
            )}
            <Suspense fallback={null}>
                <Notify />
            </Suspense>
        </AuthenticatedLayout>
    )
}

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn } = useIsLoggedIn()
    return isLoggedIn ? <>{children}</> : <Navigate to={paths.signIn} replace />
}

const RootRouter = () => {
    const { isBackendUnavailable } = useIsBackendUnavailable()

    const mapRouteToElement = (route: RouteConfig) => {
        const Component = route.Component
        const wrappedComponent = (
            <PageWrapper title={route.title}>
                <Component />
            </PageWrapper>
        )

        if (route.requiresAuth) {
            return <ProtectedRoute>{wrappedComponent}</ProtectedRoute>
        }

        return wrappedComponent
    }

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <Suspense fallback={<PseudoPage />}>
                    {isBackendUnavailable !== null ? (
                        isBackendUnavailable ? (
                            <UnderMaintenancePage />
                        ) : (
                            <Outlet />
                        )
                    ) : (
                        <PseudoPage />
                    )}
                </Suspense>
            ),
            children: [
                {
                    element: <MainLayout includeHeader includeFooter />,
                    children: routes
                        .filter((route) => !route.requiresLobbyInfo)
                        .map((route) => ({
                            path: route.path,
                            element: mapRouteToElement(route),
                        })),
                },
                {
                    element: <LobbyLayout includeHeader includeFooter />,
                    children: routes
                        .filter((route) => route.requiresLobbyInfo)
                        .map((route) => ({
                            path: route.path,
                            element: mapRouteToElement(route),
                        })),
                },
            ],
        },
        {
            path: '*',
            element: <NotFoundPage />,
        },
    ])

    return <RouterProvider router={router} />
}

export default RootRouter
