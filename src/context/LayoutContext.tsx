import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { RouteConfig } from '@models/RouteConfig'

interface LayoutContextType {
    header: boolean,
    footer: boolean,
    auth: boolean,
    lobbyInfo: boolean,

    changeConfig: (config: RouteConfig) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export const LayoutContextProvider = ({ children }: { children: ReactNode }) => {
    const [header, setHeader] = useState<boolean>(false)
    const [footer, setFooter] = useState<boolean>(false)
    const [auth, setAuth] = useState<boolean>(false)
    const [lobbyInfo, setLobbyInfo] = useState<boolean>(false)

    const changeConfig = useCallback((config: RouteConfig) => {
        setHeader(config.includeHeader ?? false)
        setFooter(config.includeFooter ?? false)
        setAuth(config.requiresAuth ?? false)
        setLobbyInfo(config.requiresLobbyInfo ?? false)
    }, [])

    return (
        <LayoutContext.Provider
            value={{
                header,
                footer,
                auth,
                lobbyInfo,
                changeConfig,
            }}
        >
            {children}
        </LayoutContext.Provider>
    )
}

export const useLayoutContext = () => {
    const context = useContext(LayoutContext)
    if (context === undefined) {
        throw new Error('useLayoutContext must be used within a LayoutContextProvider.')
    }
    return context as LayoutContextType
}
