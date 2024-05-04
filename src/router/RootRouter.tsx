import { useCallback } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import LobbyPagesLayout from '../layouts/LobbyPagesLayout'
import MainLayout from '../layouts/MainLayout'
import NotFoundPage from '../pages/NotFoundPage'
import { PageWrapper } from '../pages/PageWrapper'
import paths from './paths'
import { RouteConfig } from '../models/RouteConfig'
import routes from './routes'

const RootRouter = () => {
    const loggedIn = useIsLoggedIn()

    const generateRouteComponent = useCallback(({ path, Component, title, requiresAuth }: RouteConfig) => {
        return (
            <Route
                key={path}
                path={path}
                index={path === paths.home}
                element={
                    requiresAuth ? (
                        loggedIn ? (
                            <PageWrapper title={title}>
                                <Component />
                            </PageWrapper>
                        ) : (
                            <Navigate to={paths.signIn} />
                        )
                    ) : (
                        <PageWrapper title={title}>
                            <Component />
                        </PageWrapper>
                    )
                }
            />
        )
    }, [loggedIn])

    const generateRoutes = useCallback((routes: Array<RouteConfig>) => {
        const RequiresLobbyInfoRoutesNoHeader: Array<RouteConfig> = []
        const MainLayoutRoutesNoHeader: Array<RouteConfig> = []
        const RequiresLobbyInfoRoutesWithHeader: Array<RouteConfig> = []
        const MainLayoutRoutesWithHeader: Array<RouteConfig> = []

        routes.forEach((route) => {
            if (route.requiresLobbyInfo) {
                if (route.includeHeader) {
                    RequiresLobbyInfoRoutesWithHeader.push(route)
                } else {
                    RequiresLobbyInfoRoutesNoHeader.push(route)
                }
            } else {
                if (route.includeHeader) {
                    MainLayoutRoutesWithHeader.push(route)
                } else {
                    MainLayoutRoutesNoHeader.push(route)
                }
            }
        })

        return (
            <>
                <Route path={'/'} element={<MainLayout includeHeader />}>
                    {MainLayoutRoutesWithHeader.map(generateRouteComponent)}
                </Route>
                <Route path={'/'} element={<LobbyPagesLayout includeHeader />}>
                    {RequiresLobbyInfoRoutesWithHeader.map(generateRouteComponent)}
                </Route>
                <Route path={'/'} element={<MainLayout />}>
                    {MainLayoutRoutesNoHeader.map(generateRouteComponent)}
                </Route>
                <Route path={'/'} element={<LobbyPagesLayout />}>
                    {RequiresLobbyInfoRoutesNoHeader.map(generateRouteComponent)}
                </Route>
            </>
        )
    }, [loggedIn])

    return (
        <Router>
            <Routes>
                {generateRoutes(routes)}
                <Route
                    path="*"
                    element={
                        <PageWrapper title={'not_found'}>
                            <NotFoundPage />
                        </PageWrapper>
                    }
                />
            </Routes>
        </Router>
    )
}

export default RootRouter
