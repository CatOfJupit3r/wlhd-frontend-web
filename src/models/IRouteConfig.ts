export interface iRouteConfig {
    path: string
    Component: () => JSX.Element
    requiresAuth?: boolean
    devOnly?: boolean
    title: string
    includeHeader?: boolean
    includeFooter?: boolean
    requiresLobbyInfo?: boolean
}
