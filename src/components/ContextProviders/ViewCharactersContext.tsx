import { EntityInfoFull } from '@models/Battlefield'
import { createContext, ReactNode, useContext, useState } from 'react'

interface ViewCharactersContextType {
    viewedCharacter: EntityInfoFull | null
    descriptor: string | null

    changeViewedCharacter: (character: EntityInfoFull | null, descriptor: string | null) => void
    clearViewedCharacter: () => void
}

const ViewCharactersContext = createContext<ViewCharactersContextType | undefined>(undefined)

const ViewCharactersContextProvider = ({ children }: { children: ReactNode }) => {
    const [viewedCharacter, setViewedCharacter] = useState<EntityInfoFull | null>(null)
    const [descriptor, setDescriptor] = useState<string | null>(null)

    const changeViewedCharacter = (character: EntityInfoFull | null, descriptor: string | null) => {
        setViewedCharacter(character)
        setDescriptor(descriptor)
    }

    const clearViewedCharacter = () => {
        changeViewedCharacter(null, null)
    }

    return (
        <ViewCharactersContext.Provider
            value={{
                viewedCharacter,
                descriptor,
                changeViewedCharacter,
                clearViewedCharacter,
            }}
        >
            {children}
        </ViewCharactersContext.Provider>
    )
}

const useViewCharactersContext = () => {
    const context = useContext(ViewCharactersContext)
    if (context === undefined) {
        throw new Error('useViewCharacters must be used within a ViewCharactersContextProvider')
    }
    return context
}

export { ViewCharactersContextProvider, useViewCharactersContext }
