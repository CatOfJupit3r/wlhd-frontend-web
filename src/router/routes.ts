import DebugScreen from '../components/DebugScreen/DebugScreen'
import { RouteConfig } from '../models/RouteConfig'
import AboutPage from '../pages/AboutPage'
import CreateCombatPage from '../pages/CreateCombatPage'
import GameRoomPage from '../pages/GameRoomPage'
import GameTestPage from '../pages/GameTestPage'
import HomePage from '../pages/HomePage/HomePage'
import LobbyPage from '../pages/LobbyPage'
import ProfilePage from '../pages/ProfilePage'
import SignInPage from '../pages/SignInPage'
import SignUpPage from '../pages/SignUpPage'
import viewCharacterPage from '../pages/ViewCharacterPage'
import paths from './paths'

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

export default routes
