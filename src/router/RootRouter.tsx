import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AboutPage from '../pages/AboutPage'
import GameRoomPage from '../pages/GameRoomPage'
import HomePage from '../pages/HomePage/HomePage'
import LoginPage from '../pages/LoginPage'
import ProfilePage from '../pages/ProfilePage'
import RegisterPage from '../pages/RegisterPage'
import paths from './paths'
import NotFoundPage from '../pages/NotFoundPage'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import LobbyPage from '../pages/LobbyPage'

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

export default function RootRouter() {
    const loggedIn = useIsLoggedIn()

    return (
        <Router>
            {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
            <Routes>
                <Route path={'/'} element={<MainLayout />}>
                    <>
                        {appRoutes.map(({ path, Component: C }) => (
                            <Route key={path} path={path} index={path === paths.home} element={<C/>} />
                        ))}
                    </>
                    {loggedIn && <>
                        {authRoutes.map(({ path, Component: C }) => (
                            <Route key={path} path={path} element={<C />} />
                        ))}
                    </>
                    }
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}
