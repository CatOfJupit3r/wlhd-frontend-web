import {
    CharacterDataEditable,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@models/CombatEditorModels';
import APIService from '@services/APIService';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type ProvidedData<T> = {
    [dlc: string]: { [descriptor: string]: T };
};

type ProvidedItems = ProvidedData<ItemEditable>;
type ProvidedWeapons = ProvidedData<WeaponEditable>;
type ProvidedSpells = ProvidedData<SpellEditable>;
type ProvidedStatusEffects = ProvidedData<StatusEffectEditable>;
type ProvidedCharacters = ProvidedData<CharacterDataEditable>;

interface DataContextType {
    items: ProvidedItems | null;
    weapons: ProvidedWeapons | null;
    spells: ProvidedSpells | null;
    statusEffects: ProvidedStatusEffects | null;
    characters: ProvidedCharacters | null;

    fetchAndSetItems: (dlc: string) => Promise<void>;
    fetchAndSetWeapons: (dlc: string) => Promise<void>;
    fetchAndSetSpells: (dlc: string) => Promise<void>;
    fetchAndSetStatusEffects: (dlc: string) => Promise<void>;
    fetchAndSetCharacters: (dlc: string) => Promise<{ [descriptor: string]: CharacterDataEditable }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const GameDataProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<DataContextType['items']>(null);
    const [weapons, setWeapons] = useState<DataContextType['weapons']>(null);
    const [spells, setSpells] = useState<DataContextType['spells']>(null);
    const [statusEffects, setStatusEffects] = useState<DataContextType['statusEffects']>(null);
    const [characters, setCharacters] = useState<DataContextType['characters']>(null);

    const [alreadyFetchedContent, setAlreadyFetchedContent] = useState<{
        [dlc: string]: {
            items: boolean;
            weapons: boolean;
            spells: boolean;
            status_effects: boolean;
            characters: boolean;
        };
    }>({});

    const fetchAndSetItems = useCallback(
        async (dlc: string): Promise<void> => {
            try {
                if (!(alreadyFetchedContent[dlc]?.items ?? false)) {
                    const { items: fetched } = await APIService.getLoadedItems(dlc);
                    if (fetched) {
                        setItems({
                            ...items,
                            [dlc]: fetched,
                        });
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            items: true,
                        },
                    });
                }
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        },
        [items, alreadyFetchedContent],
    );

    const fetchAndSetWeapons = useCallback(
        async (dlc: string): Promise<void> => {
            try {
                if (!(alreadyFetchedContent[dlc]?.weapons ?? false)) {
                    const { weapons: fetched } = await APIService.getLoadedWeapons(dlc);
                    if (fetched) {
                        setWeapons({
                            ...weapons,
                            [dlc]: fetched,
                        });
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            weapons: true,
                        },
                    });
                }
            } catch (error) {
                console.error('Failed to fetch weapons:', error);
            }
        },
        [weapons, alreadyFetchedContent],
    );

    const fetchAndSetSpells = useCallback(
        async (dlc: string): Promise<void> => {
            try {
                if (!(alreadyFetchedContent[dlc]?.spells ?? false)) {
                    const { spells: fetched } = await APIService.getLoadedSpells(dlc);
                    if (fetched) {
                        setSpells({
                            ...spells,
                            [dlc]: fetched,
                        });
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            spells: true,
                        },
                    });
                }
            } catch (error) {
                console.error('Failed to fetch spells:', error);
            }
        },
        [alreadyFetchedContent, spells],
    );

    const fetchAndSetStatusEffects = useCallback(
        async (dlc: string): Promise<void> => {
            try {
                if (!(alreadyFetchedContent[dlc]?.status_effects ?? false)) {
                    const { status_effects: fetched } = await APIService.getLoadedStatusEffects(dlc);
                    if (fetched) {
                        setStatusEffects({
                            ...statusEffects,
                            [dlc]: fetched,
                        });
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            status_effects: true,
                        },
                    });
                }
            } catch (error) {
                console.error('Failed to fetch status effects:', error);
            }
        },
        [alreadyFetchedContent, statusEffects],
    );

    const fetchAndSetCharacters = useCallback(
        async (dlc: string): Promise<{ [descriptor: string]: CharacterDataEditable }> => {
            try {
                if (!(alreadyFetchedContent[dlc]?.characters ?? false)) {
                    const { characters: fetched } = await APIService.getLoadedCharacters(dlc);
                    if (fetched) {
                        setCharacters({
                            ...characters,
                            [dlc]: fetched,
                        });
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            characters: true,
                        },
                    });
                    return fetched;
                }
            } catch (error) {
                console.error('Failed to fetch characters:', error);
            }
            return {};
        },
        [alreadyFetchedContent, characters],
    );

    return (
        <DataContext.Provider
            value={{
                items,
                weapons,
                spells,
                statusEffects,
                characters,
                fetchAndSetItems,
                fetchAndSetWeapons,
                fetchAndSetSpells,
                fetchAndSetStatusEffects,
                fetchAndSetCharacters,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a GameDataProvider.');
    }
    return context as DataContextType;
};
