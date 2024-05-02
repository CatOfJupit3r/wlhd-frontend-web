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
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/ProfilePage'
import RegisterPage from '../pages/RegisterPage'
import viewCharacterPage from '../pages/ViewCharacterPage'
import paths from './paths'
import { PageWrapper } from '../pages/PageWrapper'

const authRoutes = [
    {
        path: paths.profile,
        Component: ProfilePage,
        title: 'profile',
    },
]

const lobbyRoutes = [
    {
        path: paths.lobbyRoom,
        Component: LobbyPage,
        title: 'lobby',
    },
    {
        path: paths.createCombatRoom,
        Component: CreateCombatPage,
        title: 'create_combat',
    },
    {
        path: paths.viewCharacter,
        Component: viewCharacterPage,
        title: 'view_character',
    },
]

const appRoutes = [
    {
        path: paths.home,
        Component: HomePage,
        title: 'home',
    },
    {
        path: paths.about,
        Component: AboutPage,
        title: 'about',
    },
    {
        path: paths.login,
        Component: LoginPage,
        title: 'login',
    },
    {
        path: paths.signUp,
        Component: RegisterPage,
        title: 'signup',
    },
]

const noHeaderRoutes = [
    {
        path: paths.gameTest,
        Component: GameTestPage,
        title: 'game_test',
    },
    {
        path: paths.debugRoom,
        Component: DebugScreen,
        title: 'debug',
    },
]

const noHeaderButAuth = [
    {
        path: paths.gameRoom,
        Component: GameRoomPage,
        title: 'game_room',
    },
]

const RootRouter = () => {
    const loggedIn = useIsLoggedIn()

    return (
        <Router>
            <Routes>
                <Route path={'/'} element={<MainLayout />}>
                    {appRoutes.map(({ path, Component: C, title }) => (
                        <Route
                            key={path}
                            path={path}
                            index={path === paths.home}
                            element={<PageWrapper title={title}> <C /> </PageWrapper>}
                        />
                    ))}
                    {authRoutes.map(({ path, Component: C, title }) => (
                        <Route
                            key={path}
                            path={path}
                            element={loggedIn ? <PageWrapper title={title}> <C /> </PageWrapper> : <Navigate to={paths.login} />}
                        />
                    ))}
                </Route>
                <Route path={'/'} element={<LobbyPagesLayout header />}>
                    {lobbyRoutes.map(({ path, Component: C, title }) => (
                        <Route
                            key={path}
                            path={path}
                            element={loggedIn ? <PageWrapper title={title}> <C /> </PageWrapper> : <Navigate to={paths.login} />}
                        />
                    ))}
                </Route>
                <Route path={'/'} element={<LobbyPagesLayout header={false} />}>
                    {noHeaderButAuth.map(({ path, Component: C, title }) => (
                        <Route
                            key={path}
                            path={path}
                            element={loggedIn ? <PageWrapper title={title}> <C /> </PageWrapper> : <Navigate to={paths.login} />}
                        />
                    ))}
                </Route>
                {noHeaderRoutes.map(({ path, Component: C, title }) => (
                    <Route key={path} path={path} element={<PageWrapper title={title}> <C /> </PageWrapper>} />
                ))}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}


export default RootRouter