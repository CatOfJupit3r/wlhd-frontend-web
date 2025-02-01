import { CharacterDataEditable } from '@models/CombatEditorModels';
import APIService from '@services/APIService';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type ProvidedData<T> = {
    [descriptor: string]: T | null;
};

type ProvidedCharacters = ProvidedData<CharacterDataEditable>;

interface DataContextType {
    characters: ProvidedCharacters;
    fetchCharacter: (lobbyId: string, descriptor: string, force?: boolean) => Promise<CharacterDataEditable | null>;
    getCharacter: (descriptor: string) => CharacterDataEditable | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const CoordinatorCharactersProvider = ({ children }: { children: ReactNode }) => {
    const [characters, setCharacters] = useState<DataContextType['characters']>({});

    const fetchCharacter: DataContextType['fetchCharacter'] = useCallback(
        async (lobbyId: string, descriptor: string, force?: boolean): Promise<CharacterDataEditable | null> => {
            if (characters[descriptor] === undefined || force) {
                const fetched = await APIService.getCharacterInfo(lobbyId, descriptor);
                if (fetched) {
                    setCharacters({
                        ...characters,
                        [descriptor]: fetched,
                    });
                    return fetched;
                } else {
                    throw new Error('Character not found.');
                }
            }
            return characters[descriptor];
        },
        [characters],
    );

    const getCharacter: DataContextType['getCharacter'] = useCallback(
        (descriptor: string) => {
            return characters[descriptor];
        },
        [characters],
    );

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
    );
};

export const useCoordinatorCharactersContext = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useCoordinatorCharactersContext must be used within a CoordinatorCharactersProvider.');
    }
    return context as DataContextType;
};
