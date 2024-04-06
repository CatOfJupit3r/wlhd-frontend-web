import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import MainLayout from '../layouts/MainLayout'
import AboutPage from '../pages/AboutPage'
import GameRoomPage from '../pages/GameRoomPage'
import GameTestPage from '../pages/GameTestPage'
import HomePage from '../pages/HomePage/HomePage'
import LobbyPage from '../pages/LobbyPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/ProfilePage'
import RegisterPage from '../pages/RegisterPage'
import paths from './paths'
import CreateCombatPage from '../pages/CreateCombatPage'

const authRoutes = [
    {
        path: paths.profile,
        Component: ProfilePage,
    },
    {
        path: paths.gameRoom,
        Component: GameRoomPage,
    },
    {
        path: paths.lobbyRoom,
        Component: LobbyPage,
    },
    {
        path: paths.createCombatRoom,
        Component: CreateCombatPage,
    }
]

const appRoutes = [
    {
        path: paths.home,
        Component: HomePage,
    },
    {
        path: paths.about,
        Component: AboutPage,
    },
    {
        path: paths.login,
        Component: LoginPage,
    },
    {
        path: paths.signUp,
        Component: RegisterPage,
    },
]

const noHeaderRoutes = [
    {
        path: paths.gameTest,
        Component: GameTestPage,
    },
]

export default function RootRouter() {
    const loggedIn = useIsLoggedIn()

    return (
        <Router>
            {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
            <Routes>
                <Route path={'/'} element={<MainLayout />}>
                    {appRoutes.map(({ path, Component: C }) => (
                        <Route key={path} path={path} index={path === paths.home} element={<C />} />
                    ))}
                    {authRoutes.map(({ path, Component: C }) => (
                        <Route key={path} path={path} element={loggedIn ? <C /> : <Navigate to={paths.login} />} />
                    ))}
                </Route>
                {
                    noHeaderRoutes.map(({ path, Component: C }) => (
                        <Route key={path} path={path} element={<C />} />
                    ))
                }
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}
