import { ComponentType, useCallback } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import DebugScreen from '../components/DebugScreen/DebugScreen'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import LobbyPagesLayout from '../layouts/LobbyPagesLayout'
import MainLayout from '../layouts/MainLayout'
import AboutPage from '../pages/AboutPage'
import CreateCombatPage from '../pages/CreateCombatPage'
import GameRoomPage from '../pages/GameRoomPage'
import GameTestPage from '../pages/GameTestPage'
import HomePage from '../pages/HomePage/HomePage'
import LobbyPage from '../pages/LobbyPage'
import NotFoundPage from '../pages/NotFoundPage'
import { PageWrapper } from '../pages/PageWrapper'
import ProfilePage from '../pages/ProfilePage'
import SignInPage from '../pages/SignInPage'
import SignUpPage from '../pages/SignUpPage'
import viewCharacterPage from '../pages/ViewCharacterPage'
import paths from './paths'

interface RouteConfig {
    path: string
    Component: ComponentType
    title: string
    includeHeader?: boolean
    requiresAuth?: boolean
    requiresLobbyInfo?: boolean
}

const routes: Array<RouteConfig> = [
    {
        path: paths.profile,
        Component: ProfilePage,
        title: 'profile',
        includeHeader: true,
        requiresAuth: true,
    },
    {
        path: paths.lobbyRoom,
        Component: LobbyPage,
        title: 'lobby',
        includeHeader: true,
        requiresAuth: true,
        requiresLobbyInfo: true,
    },
    {
        path: paths.createCombatRoom,
        Component: CreateCombatPage,
        title: 'create_combat',
        includeHeader: true,
        requiresAuth: true,
        requiresLobbyInfo: true,
    },
    {
        path: paths.viewCharacter,
        Component: viewCharacterPage,
        title: 'view_character',
        includeHeader: true,
        requiresAuth: true,
        requiresLobbyInfo: true,
    },
    {
        path: paths.home,
        Component: HomePage,
        title: 'home',
        includeHeader: true,
    },
    {
        path: paths.about,
        Component: AboutPage,
        title: 'about',
        includeHeader: true,
    },
    {
        path: paths.gameTest,
        Component: GameTestPage,
        title: 'game_test',
        includeHeader: true,
    },
    {
        path: paths.debugRoom,
        Component: DebugScreen,
        title: 'debug',
        includeHeader: true,
    },
    {
        path: paths.signIn,
        Component: SignInPage,
        title: 'signin',
    },
    {
        path: paths.signUp,
        Component: SignUpPage,
        title: 'signup',
    },
    {
        path: paths.gameRoom,
        Component: GameRoomPage,
        title: 'game_room',
        requiresLobbyInfo: true,
    },
]

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
    }, [])

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
    }, [])

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
