import { iRouteConfig } from '@models/IRouteConfig'
import AboutPage from '@pages/AboutPage'
import CreateCharacterPage from '@pages/CreateCharacterPage'
import CreateCombatPage from '@pages/CreateCombatPage'
import GameRoomPage from '@pages/GameRoomPage'
import GameTestPage from '@pages/GameTestPage'
import GameWikiPage from '@pages/GameWikiPage'
import HomePage from '@pages/HomePage'
import LobbyPage from '@pages/LobbyPage'
import ProfilePage from '@pages/ProfilePage'
import SignInPage from '@pages/SignInPage'
import SignUpPage from '@pages/SignUpPage'
import viewCharacterPage from '@pages/ViewCharacterPage'
import { IS_DEVELOPMENT } from 'config'
import paths from './paths'

const routes: Array<iRouteConfig> = [
    {
        path: paths.profile,
        Component: ProfilePage,
        title: 'profile',
        includeHeader: true,
        requiresAuth: true,
        includeFooter: true,
    },
    {
        path: paths.lobbyRoom,
        Component: LobbyPage,
        title: 'lobby',
        includeHeader: true,
        requiresAuth: true,
        requiresLobbyInfo: true,
        includeFooter: true,
    },
    {
        path: paths.createCombatRoom,
        Component: CreateCombatPage,
        title: 'create-combat',
        requiresAuth: true,
        requiresLobbyInfo: true,
    },
    {
        path: paths.viewCharacter,
        Component: viewCharacterPage,
        title: 'view-character',
        includeHeader: true,
        requiresAuth: true,
        requiresLobbyInfo: true,
        includeFooter: true,
    },
    {
        path: paths.home,
        Component: HomePage,
        title: 'home',
        includeHeader: true,
        includeFooter: true,
    },
    {
        path: paths.about,
        Component: AboutPage,
        title: 'about',
        includeHeader: true,
        includeFooter: true,
    },
    {
        path: paths.signIn,
        Component: SignInPage,
        title: 'sign-in',
        includeFooter: false,
        includeHeader: false,
    },
    {
        path: paths.signUp,
        Component: SignUpPage,
        title: 'sign-up',
    },
    {
        path: paths.gameRoom,
        Component: GameRoomPage,
        title: 'game-room',
        requiresLobbyInfo: true,
    },
    {
        path: paths.createCharacter,
        Component: CreateCharacterPage,
        title: 'create-character',
        requiresLobbyInfo: true,
        includeFooter: true,
        includeHeader: true,
        requiresAuth: true,
    },
    {
        // this room is only to view how game screen components will look without connecting to the backend
        path: paths.gameTest,
        Component: GameTestPage,
        devOnly: true,
        title: 'game-test',
    },
    {
        path: paths.wiki,
        Component: GameWikiPage,
        title: 'game-wiki',
        requiresAuth: true,
        includeHeader: true,
        includeFooter: true,
    },
    {
        path: paths.wikiWithDLC,
        Component: GameWikiPage,
        title: 'game-wiki',
        requiresAuth: true,
        includeHeader: true,
        includeFooter: true,
    },
]
console.log(IS_DEVELOPMENT, import.meta.env.NODE_ENV)
export const authRoutes = routes
    .filter((route) => route.requiresAuth)
    .filter((route) => !route.devOnly || (route.devOnly && IS_DEVELOPMENT))
export const generalRoutes = routes
    .filter((route) => !route.requiresAuth)
    .filter((route) => !route.devOnly || (route.devOnly && IS_DEVELOPMENT))
