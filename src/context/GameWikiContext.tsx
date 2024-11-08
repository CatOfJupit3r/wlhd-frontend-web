import React, { createContext, ReactNode, useCallback, useContext } from 'react'

interface iGameWikiContext {
    dlc: string
    changeDlc: (dlc: string) => void
}

const GameWikiContext = createContext<iGameWikiContext | undefined>(undefined)

export const GameWikiContextProvider = ({ children }: { children: ReactNode }) => {
    const [dlc, setDlc] = React.useState<string>('builtins')

    const changeDlc = useCallback((dlc: string) => {
        setDlc(dlc)
    }, [])

    return (
        <GameWikiContext.Provider
            value={{
                dlc,
                changeDlc,
            }}
        >
            {children}
        </GameWikiContext.Provider>
    )
}

export const useGameWikiContext = () => {
    const context = useContext(GameWikiContext)
    if (context === undefined) {
        throw new Error('useGameWikiContext must be used within a GameWikiContextProvider.')
    }
    return context as iGameWikiContext
}
