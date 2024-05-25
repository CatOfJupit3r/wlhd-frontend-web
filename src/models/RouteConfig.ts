import { ComponentType } from 'react'

export interface RouteConfig {
    path: string
    Component: ComponentType
    title: string
    includeHeader?: boolean
    includeFooter?: boolean
    requiresAuth?: boolean
    requiresLobbyInfo?: boolean
}
