import { iRouteConfig } from '@models/IRouteConfig';
import { IS_DEVELOPMENT } from 'config';
import { lazy } from 'react';
import paths from './paths';

const AboutPage = lazy(() => import('@pages/AboutPage'));
const CreateCharacterPage = lazy(() => import('@pages/CreateCharacterPage'));
const CreateCombatPage = lazy(() => import('@pages/CreateCombatPage'));
const GameRoomPage = lazy(() => import('@pages/GameRoomPage'));
const GameTestPage = lazy(() => import('@pages/GameTestPage'));
const GameWikiPage = lazy(() => import('@pages/GameWikiPage'));
const HomePage = lazy(() => import('@pages/HomePage'));
const LobbyPage = lazy(() => import('@pages/LobbyPage'));
const ProfilePage = lazy(() => import('@pages/ProfilePage'));
const SignInPage = lazy(() => import('@pages/SignInPage'));
const SignUpPage = lazy(() => import('@pages/SignUpPage'));
const ViewCharacterPage = lazy(() => import('@pages/ViewCharacterPage'));

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
        Component: ViewCharacterPage,
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
];

export const authRoutes = routes
    .filter((route) => route.requiresAuth)
    .filter((route) => !route.devOnly || (route.devOnly && IS_DEVELOPMENT));
export const generalRoutes = routes
    .filter((route) => !route.requiresAuth)
    .filter((route) => !route.devOnly || (route.devOnly && IS_DEVELOPMENT));
