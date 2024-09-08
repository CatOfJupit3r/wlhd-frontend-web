export interface RouteConfig {
    path: string
    Component: () => JSX.Element
    title: string
    includeHeader?: boolean
    includeFooter?: boolean
    requiresAuth?: boolean
    requiresLobbyInfo?: boolean
}
