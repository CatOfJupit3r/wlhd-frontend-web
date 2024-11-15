import { iRouteConfig } from '@models/IRouteConfig'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

interface LayoutContextType {
    header: boolean
    footer: boolean
    auth: boolean
    lobbyInfo: boolean

    changeConfig: (config: iRouteConfig) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export const LayoutContextProvider = ({ children }: { children: ReactNode }) => {
    const [header, setHeader] = useState<boolean>(false)
    const [footer, setFooter] = useState<boolean>(false)
    const [auth, setAuth] = useState<boolean>(false)
    const [lobbyInfo, setLobbyInfo] = useState<boolean>(false)

    const changeConfig = useCallback((config: iRouteConfig) => {
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
