import useIsBackendUnavailable from '@hooks/useIsBackendUnavailable'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { RouteConfig } from '@models/RouteConfig'
import NotFoundPage from '@pages/NotFoundPage'
import { PageWrapper } from '@pages/PageWrapper'
import PseudoPage from '@pages/PseudoPage'
import UnderMaintenancePage from '@pages/UnderMaintenancePage'
import { JSX, useCallback } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import LobbyPagesLayout from '../layouts/LobbyPagesLayout'
import MainLayout from '../layouts/MainLayout'
import paths from './paths'
import routes from './routes'

const RootRouter = () => {
    const { isLoggedIn } = useIsLoggedIn()
    const { isBackendUnavailable } = useIsBackendUnavailable()

    const generateRouteComponent = useCallback(
        ({ path, Component, title, requiresAuth }: RouteConfig) => {
            return (
                <Route
                    key={path}
                    path={path}
                    index={path === paths.home}
                    element={
                        requiresAuth ? (
                            isLoggedIn ? (
                                <PageWrapper title={title}>
                                    {Component ? <Component /> : <UnderMaintenancePage />}
                                </PageWrapper>
                            ) : (
                                <Navigate to={paths.signIn} />
                            )
                        ) : (
                            <PageWrapper title={title}>
                                {Component ? <Component /> : <UnderMaintenancePage />}
                            </PageWrapper>
                        )
                    }
                />
            )
        },
        [isLoggedIn]
    )

    const generateRoutes = useCallback(
        (routes: Array<RouteConfig>) => {
            const routeGroups: { [group: string]: Array<RouteConfig> } = {}

            routes.forEach((route) => {
                const key = `${route.requiresLobbyInfo ? 'lobby' : 'main'}${route.includeHeader ? 'WithHeader' : 'WithoutHeader'}${route.includeFooter ? 'WithFooter' : 'WithoutFooter'}`
                if (!routeGroups[key]) {
                    routeGroups[key] = []
                }
                routeGroups[key].push(route)
            })

            const layouts: { [config: string]: JSX.Element } = {
                mainWithHeaderWithFooter: <MainLayout includeHeader includeFooter />,
                mainWithHeaderWithoutFooter: <MainLayout includeHeader />,
                mainWithoutHeaderWithFooter: <MainLayout includeFooter />,
                mainWithoutHeaderWithoutFooter: <MainLayout />,
                lobbyWithHeaderWithFooter: <LobbyPagesLayout includeHeader includeFooter />,
                lobbyWithHeaderWithoutFooter: <LobbyPagesLayout includeHeader />,
                lobbyWithoutHeaderWithFooter: <LobbyPagesLayout includeFooter />,
                lobbyWithoutHeaderWithoutFooter: <LobbyPagesLayout />,
            }

            return (
                <>
                    {Object.entries(routeGroups).map(([key, routes]) => (
                        <Route key={key} path="/" element={layouts[key]}>
                            {routes.map(generateRouteComponent)}
                        </Route>
                    ))}
                </>
            )
        },
        [isLoggedIn]
    )

    return (
        <Router>
            <Routes>
                {typeof isBackendUnavailable === 'boolean' ? (
                    isBackendUnavailable ? (
                        <Route
                            path="*"
                            element={
                                <PageWrapper title={'backend_unavailable'}>
                                    <UnderMaintenancePage />
                                </PageWrapper>
                            }
                        />
                    ) : (
                        <>
                            {generateRoutes(routes)}
                            <Route
                                path="*"
                                element={
                                    <PageWrapper title={'not_found'}>
                                        <NotFoundPage />
                                    </PageWrapper>
                                }
                            />
                        </>
                    )
                ) : (
                    <Route
                        path="*"
                        element={
                            <PageWrapper title={'loading'}>
                                <PseudoPage />
                            </PageWrapper>
                        }
                    />
                )}
            </Routes>
        </Router>
    )
}

export default RootRouter
