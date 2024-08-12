import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { EntityInfoFull, ItemInfo, SpellInfo, StatusEffectInfo, WeaponInfo } from '@models/Battlefield'
import APIService from '@services/APIService'

type ProvidedData<T> = {
    [dlc: string]: { [descriptor: string]: T }
}

type ProvidedItems = ProvidedData<ItemInfo>
type ProvidedWeapons = ProvidedData<WeaponInfo>
type ProvidedSpells = ProvidedData<SpellInfo>
type ProvidedStatusEffects = ProvidedData<StatusEffectInfo>
type ProvidedEntities = ProvidedData<EntityInfoFull>

interface DataContextType {
    items: ProvidedItems | null
    weapons: ProvidedWeapons | null
    spells: ProvidedSpells | null
    statusEffects: ProvidedStatusEffects | null
    entities: ProvidedEntities | null

    fetchAndSetItems: (dlc: string) => Promise<void>
    fetchAndSetWeapons: (dlc: string) => Promise<void>
    fetchAndSetSpells: (dlc: string) => Promise<void>
    fetchAndSetStatusEffects: (dlc: string) => Promise<void>
    fetchAndSetEntities: (dlc: string) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const GameDataProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<DataContextType['items']>(null)
    const [weapons, setWeapons] = useState<DataContextType['weapons']>(null)
    const [spells, setSpells] = useState<DataContextType['spells']>(null)
    const [statusEffects, setStatusEffects] = useState<DataContextType['statusEffects']>(null)
    const [entities, setEntities] = useState<DataContextType['entities']>(null)

    const [alreadyFetchedContent, setAlreadyFetchedContent] = useState<{
        [dlc: string]: {
            items: boolean
            weapons: boolean
            spells: boolean
            status_effects: boolean
            entities: boolean
        }
    }>({})

    const fetchAndSetItems = useCallback(
        async (dlc: string): Promise<void> => {
            try {
                if (!alreadyFetchedContent[dlc]?.items ?? false) {
                    const { items: fetched } = await APIService.getLoadedItems(dlc)
                    if (fetched) {
                        setItems({
                            ...items,
                            [dlc]: fetched,
                        })
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            items: true,
                        },
                    })
                }
            } catch (error) {
                console.error('Failed to fetch items:', error)
            }
        },
        [items, alreadyFetchedContent]
    )

    const fetchAndSetWeapons = useCallback(
        async (dlc: string): Promise<void> => {
            try {
                if (!(alreadyFetchedContent[dlc]?.weapons ?? false)) {
                    const { weapons: fetched } = await APIService.getLoadedWeapons(dlc)
                    if (fetched) {
                        setWeapons({
                            ...weapons,
                            [dlc]: fetched,
                        })
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            weapons: true,
                        },
                    })
                }
            } catch (error) {
                console.error('Failed to fetch weapons:', error)
            }
        },
        [weapons, alreadyFetchedContent]
    )

    const fetchAndSetSpells = useCallback(
        async (dlc: string): Promise<void> => {
            try {
                if (!(alreadyFetchedContent[dlc]?.spells ?? false)) {
                    const { spells: fetched } = await APIService.getLoadedSpells(dlc)
                    if (fetched) {
                        setSpells({
                            ...spells,
                            [dlc]: fetched,
                        })
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            spells: true,
                        },
                    })
                }
            } catch (error) {
                console.error('Failed to fetch spells:', error)
            }
        },
        [alreadyFetchedContent, spells]
    )

    const fetchAndSetStatusEffects = useCallback(
        async (dlc: string): Promise<void> => {
            try {
                if (!(alreadyFetchedContent[dlc]?.status_effects ?? false)) {
                    const { status_effects: fetched } = await APIService.getLoadedStatusEffects(dlc)
                    if (fetched) {
                        setStatusEffects({
                            ...statusEffects,
                            [dlc]: fetched,
                        })
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            status_effects: true,
                        },
                    })
                }
            } catch (error) {
                console.error('Failed to fetch status effects:', error)
            }
        },
        [alreadyFetchedContent, statusEffects]
    )

    const fetchAndSetEntities = useCallback(
        async (dlc: string): Promise<void> => {
            try {
                if (!(alreadyFetchedContent[dlc]?.entities ?? false)) {
                    const { characters: fetched } = await APIService.getLoadedCharacters(dlc)
                    if (fetched) {
                        setEntities({
                            ...entities,
                            [dlc]: fetched,
                        })
                    }
                    setAlreadyFetchedContent({
                        ...alreadyFetchedContent,
                        [dlc]: {
                            ...alreadyFetchedContent[dlc],
                            entities: true,
                        },
                    })
                }
            } catch (error) {
                console.error('Failed to fetch entities:', error)
            }
        },
        [alreadyFetchedContent, entities]
    )

    return (
        <DataContext.Provider
            value={{
                items,
                weapons,
                spells,
                statusEffects,
                entities,
                fetchAndSetItems,
                fetchAndSetWeapons,
                fetchAndSetSpells,
                fetchAndSetStatusEffects,
                fetchAndSetEntities
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export const useDataContext = () => {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error('useDataContext must be used within a GameDataProvider.')
    }
    return context as DataContextType
}
