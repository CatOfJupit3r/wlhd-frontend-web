/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as AuthonlyImport } from './routes/_auth_only';
import { Route as IndexImport } from './routes/index';
import { Route as AuthonlyProfileImport } from './routes/_auth_only/profile';
import { Route as AuthonlyGameTestImport } from './routes/_auth_only/game-test';
import { Route as generalSignUpImport } from './routes/(general)/sign-up';
import { Route as generalLoginImport } from './routes/(general)/login';
import { Route as generalAboutImport } from './routes/(general)/about';
import { Route as AuthonlyGameWikiIndexImport } from './routes/_auth_only/game-wiki/index';
import { Route as AuthonlyGameWikiDlcImport } from './routes/_auth_only/game-wiki/$dlc';
import { Route as AuthonlyLobbyRoomsLobbyIdIndexImport } from './routes/_auth_only/lobby-rooms/$lobbyId/index';
import { Route as AuthonlyLobbyRoomsLobbyIdViewCharacterImport } from './routes/_auth_only/lobby-rooms/$lobbyId/view-character';
import { Route as AuthonlyLobbyRoomsLobbyIdCreateCombatImport } from './routes/_auth_only/lobby-rooms/$lobbyId/create-combat';
import { Route as AuthonlyLobbyRoomsLobbyIdCreateCharacterImport } from './routes/_auth_only/lobby-rooms/$lobbyId/create-character';
import { Route as AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdImport } from './routes/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId';

// Create/Update Routes

const AuthonlyRoute = AuthonlyImport.update({
  id: '/_auth_only',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

const AuthonlyProfileRoute = AuthonlyProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AuthonlyRoute,
} as any);

const AuthonlyGameTestRoute = AuthonlyGameTestImport.update({
  id: '/game-test',
  path: '/game-test',
  getParentRoute: () => AuthonlyRoute,
} as any);

const generalSignUpRoute = generalSignUpImport.update({
  id: '/(general)/sign-up',
  path: '/sign-up',
  getParentRoute: () => rootRoute,
} as any);

const generalLoginRoute = generalLoginImport.update({
  id: '/(general)/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any);

const generalAboutRoute = generalAboutImport.update({
  id: '/(general)/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any);

const AuthonlyGameWikiIndexRoute = AuthonlyGameWikiIndexImport.update({
  id: '/game-wiki/',
  path: '/game-wiki/',
  getParentRoute: () => AuthonlyRoute,
} as any);

const AuthonlyGameWikiDlcRoute = AuthonlyGameWikiDlcImport.update({
  id: '/game-wiki/$dlc',
  path: '/game-wiki/$dlc',
  getParentRoute: () => AuthonlyRoute,
} as any);

const AuthonlyLobbyRoomsLobbyIdIndexRoute =
  AuthonlyLobbyRoomsLobbyIdIndexImport.update({
    id: '/lobby-rooms/$lobbyId/',
    path: '/lobby-rooms/$lobbyId/',
    getParentRoute: () => AuthonlyRoute,
  } as any);

const AuthonlyLobbyRoomsLobbyIdViewCharacterRoute =
  AuthonlyLobbyRoomsLobbyIdViewCharacterImport.update({
    id: '/lobby-rooms/$lobbyId/view-character',
    path: '/lobby-rooms/$lobbyId/view-character',
    getParentRoute: () => AuthonlyRoute,
  } as any);

const AuthonlyLobbyRoomsLobbyIdCreateCombatRoute =
  AuthonlyLobbyRoomsLobbyIdCreateCombatImport.update({
    id: '/lobby-rooms/$lobbyId/create-combat',
    path: '/lobby-rooms/$lobbyId/create-combat',
    getParentRoute: () => AuthonlyRoute,
  } as any);

const AuthonlyLobbyRoomsLobbyIdCreateCharacterRoute =
  AuthonlyLobbyRoomsLobbyIdCreateCharacterImport.update({
    id: '/lobby-rooms/$lobbyId/create-character',
    path: '/lobby-rooms/$lobbyId/create-character',
    getParentRoute: () => AuthonlyRoute,
  } as any);

const AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdRoute =
  AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdImport.update({
    id: '/lobby-rooms/$lobbyId/game-rooms/$gameId',
    path: '/lobby-rooms/$lobbyId/game-rooms/$gameId',
    getParentRoute: () => AuthonlyRoute,
  } as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/_auth_only': {
      id: '/_auth_only';
      path: '';
      fullPath: '';
      preLoaderRoute: typeof AuthonlyImport;
      parentRoute: typeof rootRoute;
    };
    '/(general)/about': {
      id: '/(general)/about';
      path: '/about';
      fullPath: '/about';
      preLoaderRoute: typeof generalAboutImport;
      parentRoute: typeof rootRoute;
    };
    '/(general)/login': {
      id: '/(general)/login';
      path: '/login';
      fullPath: '/login';
      preLoaderRoute: typeof generalLoginImport;
      parentRoute: typeof rootRoute;
    };
    '/(general)/sign-up': {
      id: '/(general)/sign-up';
      path: '/sign-up';
      fullPath: '/sign-up';
      preLoaderRoute: typeof generalSignUpImport;
      parentRoute: typeof rootRoute;
    };
    '/_auth_only/game-test': {
      id: '/_auth_only/game-test';
      path: '/game-test';
      fullPath: '/game-test';
      preLoaderRoute: typeof AuthonlyGameTestImport;
      parentRoute: typeof AuthonlyImport;
    };
    '/_auth_only/profile': {
      id: '/_auth_only/profile';
      path: '/profile';
      fullPath: '/profile';
      preLoaderRoute: typeof AuthonlyProfileImport;
      parentRoute: typeof AuthonlyImport;
    };
    '/_auth_only/game-wiki/$dlc': {
      id: '/_auth_only/game-wiki/$dlc';
      path: '/game-wiki/$dlc';
      fullPath: '/game-wiki/$dlc';
      preLoaderRoute: typeof AuthonlyGameWikiDlcImport;
      parentRoute: typeof AuthonlyImport;
    };
    '/_auth_only/game-wiki/': {
      id: '/_auth_only/game-wiki/';
      path: '/game-wiki';
      fullPath: '/game-wiki';
      preLoaderRoute: typeof AuthonlyGameWikiIndexImport;
      parentRoute: typeof AuthonlyImport;
    };
    '/_auth_only/lobby-rooms/$lobbyId/create-character': {
      id: '/_auth_only/lobby-rooms/$lobbyId/create-character';
      path: '/lobby-rooms/$lobbyId/create-character';
      fullPath: '/lobby-rooms/$lobbyId/create-character';
      preLoaderRoute: typeof AuthonlyLobbyRoomsLobbyIdCreateCharacterImport;
      parentRoute: typeof AuthonlyImport;
    };
    '/_auth_only/lobby-rooms/$lobbyId/create-combat': {
      id: '/_auth_only/lobby-rooms/$lobbyId/create-combat';
      path: '/lobby-rooms/$lobbyId/create-combat';
      fullPath: '/lobby-rooms/$lobbyId/create-combat';
      preLoaderRoute: typeof AuthonlyLobbyRoomsLobbyIdCreateCombatImport;
      parentRoute: typeof AuthonlyImport;
    };
    '/_auth_only/lobby-rooms/$lobbyId/view-character': {
      id: '/_auth_only/lobby-rooms/$lobbyId/view-character';
      path: '/lobby-rooms/$lobbyId/view-character';
      fullPath: '/lobby-rooms/$lobbyId/view-character';
      preLoaderRoute: typeof AuthonlyLobbyRoomsLobbyIdViewCharacterImport;
      parentRoute: typeof AuthonlyImport;
    };
    '/_auth_only/lobby-rooms/$lobbyId/': {
      id: '/_auth_only/lobby-rooms/$lobbyId/';
      path: '/lobby-rooms/$lobbyId';
      fullPath: '/lobby-rooms/$lobbyId';
      preLoaderRoute: typeof AuthonlyLobbyRoomsLobbyIdIndexImport;
      parentRoute: typeof AuthonlyImport;
    };
    '/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId': {
      id: '/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId';
      path: '/lobby-rooms/$lobbyId/game-rooms/$gameId';
      fullPath: '/lobby-rooms/$lobbyId/game-rooms/$gameId';
      preLoaderRoute: typeof AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdImport;
      parentRoute: typeof AuthonlyImport;
    };
  }
}

// Create and export the route tree

interface AuthonlyRouteChildren {
  AuthonlyGameTestRoute: typeof AuthonlyGameTestRoute;
  AuthonlyProfileRoute: typeof AuthonlyProfileRoute;
  AuthonlyGameWikiDlcRoute: typeof AuthonlyGameWikiDlcRoute;
  AuthonlyGameWikiIndexRoute: typeof AuthonlyGameWikiIndexRoute;
  AuthonlyLobbyRoomsLobbyIdCreateCharacterRoute: typeof AuthonlyLobbyRoomsLobbyIdCreateCharacterRoute;
  AuthonlyLobbyRoomsLobbyIdCreateCombatRoute: typeof AuthonlyLobbyRoomsLobbyIdCreateCombatRoute;
  AuthonlyLobbyRoomsLobbyIdViewCharacterRoute: typeof AuthonlyLobbyRoomsLobbyIdViewCharacterRoute;
  AuthonlyLobbyRoomsLobbyIdIndexRoute: typeof AuthonlyLobbyRoomsLobbyIdIndexRoute;
  AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdRoute: typeof AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdRoute;
}

const AuthonlyRouteChildren: AuthonlyRouteChildren = {
  AuthonlyGameTestRoute: AuthonlyGameTestRoute,
  AuthonlyProfileRoute: AuthonlyProfileRoute,
  AuthonlyGameWikiDlcRoute: AuthonlyGameWikiDlcRoute,
  AuthonlyGameWikiIndexRoute: AuthonlyGameWikiIndexRoute,
  AuthonlyLobbyRoomsLobbyIdCreateCharacterRoute:
    AuthonlyLobbyRoomsLobbyIdCreateCharacterRoute,
  AuthonlyLobbyRoomsLobbyIdCreateCombatRoute:
    AuthonlyLobbyRoomsLobbyIdCreateCombatRoute,
  AuthonlyLobbyRoomsLobbyIdViewCharacterRoute:
    AuthonlyLobbyRoomsLobbyIdViewCharacterRoute,
  AuthonlyLobbyRoomsLobbyIdIndexRoute: AuthonlyLobbyRoomsLobbyIdIndexRoute,
  AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdRoute:
    AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdRoute,
};

const AuthonlyRouteWithChildren = AuthonlyRoute._addFileChildren(
  AuthonlyRouteChildren,
);

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '': typeof AuthonlyRouteWithChildren;
  '/about': typeof generalAboutRoute;
  '/login': typeof generalLoginRoute;
  '/sign-up': typeof generalSignUpRoute;
  '/game-test': typeof AuthonlyGameTestRoute;
  '/profile': typeof AuthonlyProfileRoute;
  '/game-wiki/$dlc': typeof AuthonlyGameWikiDlcRoute;
  '/game-wiki': typeof AuthonlyGameWikiIndexRoute;
  '/lobby-rooms/$lobbyId/create-character': typeof AuthonlyLobbyRoomsLobbyIdCreateCharacterRoute;
  '/lobby-rooms/$lobbyId/create-combat': typeof AuthonlyLobbyRoomsLobbyIdCreateCombatRoute;
  '/lobby-rooms/$lobbyId/view-character': typeof AuthonlyLobbyRoomsLobbyIdViewCharacterRoute;
  '/lobby-rooms/$lobbyId': typeof AuthonlyLobbyRoomsLobbyIdIndexRoute;
  '/lobby-rooms/$lobbyId/game-rooms/$gameId': typeof AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '': typeof AuthonlyRouteWithChildren;
  '/about': typeof generalAboutRoute;
  '/login': typeof generalLoginRoute;
  '/sign-up': typeof generalSignUpRoute;
  '/game-test': typeof AuthonlyGameTestRoute;
  '/profile': typeof AuthonlyProfileRoute;
  '/game-wiki/$dlc': typeof AuthonlyGameWikiDlcRoute;
  '/game-wiki': typeof AuthonlyGameWikiIndexRoute;
  '/lobby-rooms/$lobbyId/create-character': typeof AuthonlyLobbyRoomsLobbyIdCreateCharacterRoute;
  '/lobby-rooms/$lobbyId/create-combat': typeof AuthonlyLobbyRoomsLobbyIdCreateCombatRoute;
  '/lobby-rooms/$lobbyId/view-character': typeof AuthonlyLobbyRoomsLobbyIdViewCharacterRoute;
  '/lobby-rooms/$lobbyId': typeof AuthonlyLobbyRoomsLobbyIdIndexRoute;
  '/lobby-rooms/$lobbyId/game-rooms/$gameId': typeof AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/_auth_only': typeof AuthonlyRouteWithChildren;
  '/(general)/about': typeof generalAboutRoute;
  '/(general)/login': typeof generalLoginRoute;
  '/(general)/sign-up': typeof generalSignUpRoute;
  '/_auth_only/game-test': typeof AuthonlyGameTestRoute;
  '/_auth_only/profile': typeof AuthonlyProfileRoute;
  '/_auth_only/game-wiki/$dlc': typeof AuthonlyGameWikiDlcRoute;
  '/_auth_only/game-wiki/': typeof AuthonlyGameWikiIndexRoute;
  '/_auth_only/lobby-rooms/$lobbyId/create-character': typeof AuthonlyLobbyRoomsLobbyIdCreateCharacterRoute;
  '/_auth_only/lobby-rooms/$lobbyId/create-combat': typeof AuthonlyLobbyRoomsLobbyIdCreateCombatRoute;
  '/_auth_only/lobby-rooms/$lobbyId/view-character': typeof AuthonlyLobbyRoomsLobbyIdViewCharacterRoute;
  '/_auth_only/lobby-rooms/$lobbyId/': typeof AuthonlyLobbyRoomsLobbyIdIndexRoute;
  '/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId': typeof AuthonlyLobbyRoomsLobbyIdGameRoomsGameIdRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | '/'
    | ''
    | '/about'
    | '/login'
    | '/sign-up'
    | '/game-test'
    | '/profile'
    | '/game-wiki/$dlc'
    | '/game-wiki'
    | '/lobby-rooms/$lobbyId/create-character'
    | '/lobby-rooms/$lobbyId/create-combat'
    | '/lobby-rooms/$lobbyId/view-character'
    | '/lobby-rooms/$lobbyId'
    | '/lobby-rooms/$lobbyId/game-rooms/$gameId';
  fileRoutesByTo: FileRoutesByTo;
  to:
    | '/'
    | ''
    | '/about'
    | '/login'
    | '/sign-up'
    | '/game-test'
    | '/profile'
    | '/game-wiki/$dlc'
    | '/game-wiki'
    | '/lobby-rooms/$lobbyId/create-character'
    | '/lobby-rooms/$lobbyId/create-combat'
    | '/lobby-rooms/$lobbyId/view-character'
    | '/lobby-rooms/$lobbyId'
    | '/lobby-rooms/$lobbyId/game-rooms/$gameId';
  id:
    | '__root__'
    | '/'
    | '/_auth_only'
    | '/(general)/about'
    | '/(general)/login'
    | '/(general)/sign-up'
    | '/_auth_only/game-test'
    | '/_auth_only/profile'
    | '/_auth_only/game-wiki/$dlc'
    | '/_auth_only/game-wiki/'
    | '/_auth_only/lobby-rooms/$lobbyId/create-character'
    | '/_auth_only/lobby-rooms/$lobbyId/create-combat'
    | '/_auth_only/lobby-rooms/$lobbyId/view-character'
    | '/_auth_only/lobby-rooms/$lobbyId/'
    | '/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  AuthonlyRoute: typeof AuthonlyRouteWithChildren;
  generalAboutRoute: typeof generalAboutRoute;
  generalLoginRoute: typeof generalLoginRoute;
  generalSignUpRoute: typeof generalSignUpRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthonlyRoute: AuthonlyRouteWithChildren,
  generalAboutRoute: generalAboutRoute,
  generalLoginRoute: generalLoginRoute,
  generalSignUpRoute: generalSignUpRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_auth_only",
        "/(general)/about",
        "/(general)/login",
        "/(general)/sign-up"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_auth_only": {
      "filePath": "_auth_only.tsx",
      "children": [
        "/_auth_only/game-test",
        "/_auth_only/profile",
        "/_auth_only/game-wiki/$dlc",
        "/_auth_only/game-wiki/",
        "/_auth_only/lobby-rooms/$lobbyId/create-character",
        "/_auth_only/lobby-rooms/$lobbyId/create-combat",
        "/_auth_only/lobby-rooms/$lobbyId/view-character",
        "/_auth_only/lobby-rooms/$lobbyId/",
        "/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId"
      ]
    },
    "/(general)/about": {
      "filePath": "(general)/about.tsx"
    },
    "/(general)/login": {
      "filePath": "(general)/login.tsx"
    },
    "/(general)/sign-up": {
      "filePath": "(general)/sign-up.tsx"
    },
    "/_auth_only/game-test": {
      "filePath": "_auth_only/game-test.tsx",
      "parent": "/_auth_only"
    },
    "/_auth_only/profile": {
      "filePath": "_auth_only/profile.tsx",
      "parent": "/_auth_only"
    },
    "/_auth_only/game-wiki/$dlc": {
      "filePath": "_auth_only/game-wiki/$dlc.tsx",
      "parent": "/_auth_only"
    },
    "/_auth_only/game-wiki/": {
      "filePath": "_auth_only/game-wiki/index.tsx",
      "parent": "/_auth_only"
    },
    "/_auth_only/lobby-rooms/$lobbyId/create-character": {
      "filePath": "_auth_only/lobby-rooms/$lobbyId/create-character.tsx",
      "parent": "/_auth_only"
    },
    "/_auth_only/lobby-rooms/$lobbyId/create-combat": {
      "filePath": "_auth_only/lobby-rooms/$lobbyId/create-combat.tsx",
      "parent": "/_auth_only"
    },
    "/_auth_only/lobby-rooms/$lobbyId/view-character": {
      "filePath": "_auth_only/lobby-rooms/$lobbyId/view-character.tsx",
      "parent": "/_auth_only"
    },
    "/_auth_only/lobby-rooms/$lobbyId/": {
      "filePath": "_auth_only/lobby-rooms/$lobbyId/index.tsx",
      "parent": "/_auth_only"
    },
    "/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId": {
      "filePath": "_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId.tsx",
      "parent": "/_auth_only"
    }
  }
}
ROUTE_MANIFEST_END */
