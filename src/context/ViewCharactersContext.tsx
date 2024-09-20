import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { CharacterDataEditable } from '@models/CombatEditorModels'

interface ViewCharactersContextType {
    viewedCharacter: CharacterDataEditable | null
    descriptor: string | null

    changeViewedCharacter: (character: CharacterDataEditable | null, descriptor: string | null) => void
    clearViewedCharacter: () => void
}

const ViewCharactersContext = createContext<ViewCharactersContextType | undefined>(undefined)

const ViewCharactersContextProvider = ({ children }: { children: ReactNode }) => {
    const [viewedCharacter, setViewedCharacter] = useState<CharacterDataEditable | null>(null)
    const [descriptor, setDescriptor] = useState<string | null>(null)

    const changeViewedCharacter = useCallback((character: CharacterDataEditable | null, descriptor: string | null) => {
        setViewedCharacter(character)
        setDescriptor(descriptor)
    }, [])

    const clearViewedCharacter = useCallback(() => {
        changeViewedCharacter(null, null)
    }, [])

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
