import { EntityInfoFull } from '@models/Battlefield'
import APIService from '@services/APIService'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

type ProvidedData<T> = {
    [descriptor: string]: T | null
}

type ProvidedCharacters = ProvidedData<EntityInfoFull>

interface DataContextType {
    characters: ProvidedCharacters
    fetchCharacter: (lobbyId: string, descriptor: string, force?: boolean) => Promise<EntityInfoFull | null>
    getCharacter: (descriptor: string) => EntityInfoFull | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const CoordinatorEntitiesProvider = ({ children }: { children: ReactNode }) => {
    const [characters, setCharacters] = useState<DataContextType['characters']>({})

    const fetchCharacter: DataContextType['fetchCharacter'] = useCallback(
        async (lobbyId: string, descriptor: string, force?: boolean): Promise<EntityInfoFull | null> => {
            if (characters[descriptor] === undefined || force) {
                const fetched = await APIService.getCharacterInfo(lobbyId, descriptor)
                if (fetched) {
                    setCharacters({
                        ...characters,
                        [descriptor]: fetched,
                    })
                    return fetched
                } else {
                    throw new Error('Character not found.')
                }
            }
            return characters[descriptor]
        },
        [characters]
    )

    const getCharacter: DataContextType['getCharacter'] = useCallback(
        (descriptor: string) => {
            return characters[descriptor]
        },
        [characters]
    )

    return (
        <DataContext.Provider
            value={{
                characters,
                fetchCharacter,
                getCharacter,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export const useCoordinatorEntitiesContext = () => {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error('useCoordinatorEntitiesContext must be used within a CoordinatorEntitiesProvider.')
    }
    return context as DataContextType
}
