import { ComponentType } from 'react'

export interface RouteConfig {
    path: string
    Component: ComponentType
    title: string
    includeHeader?: boolean
    requiresAuth?: boolean
    requiresLobbyInfo?: boolean
}
