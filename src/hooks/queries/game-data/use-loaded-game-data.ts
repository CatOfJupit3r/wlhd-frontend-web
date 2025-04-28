import { useQuery } from '@tanstack/react-query';

import APIService from '@services/api-service';

type GameDataType = 'item' | 'weapon' | 'spell' | 'status_effect' | 'area_effect' | 'character';
const GAME_DATA_QUERY_KEYS = (dlc: string, type: GameDataType) => ['game', type, dlc];

export const LOADED_ITEM_QUERY_KEYS = (dlc: string) => GAME_DATA_QUERY_KEYS(dlc, 'item');
export const LOADED_WEAPON_QUERY_KEYS = (dlc: string) => GAME_DATA_QUERY_KEYS(dlc, 'weapon');
export const LOADED_SPELL_QUERY_KEYS = (dlc: string) => GAME_DATA_QUERY_KEYS(dlc, 'spell');
export const LOADED_STATUS_EFFECT_QUERY_KEYS = (dlc: string) => GAME_DATA_QUERY_KEYS(dlc, 'status_effect');
export const LOADED_AREA_EFFECT_QUERY_KEYS = (dlc: string) => GAME_DATA_QUERY_KEYS(dlc, 'area_effect');
export const LOADED_CHARACTER_QUERY_KEYS = (dlc: string) => GAME_DATA_QUERY_KEYS(dlc, 'character');

export const LOADED_ITEMS_QUERY_FN = async (dlc: string) => {
    if (!dlc) throw new Error('DLC missing');
    console.log('Fetching item data');
    return APIService.getLoadedItems(dlc);
};
export const LOADED_WEAPONS_QUERY_FN = async (dlc: string) => {
    if (!dlc) throw new Error('DLC missing');
    console.log('Fetching weapon data');
    return APIService.getLoadedWeapons(dlc);
};
export const LOADED_SPELLS_QUERY_FN = async (dlc: string) => {
    if (!dlc) throw new Error('DLC missing');
    console.log('Fetching spell data');
    return APIService.getLoadedSpells(dlc);
};
export const LOADED_STATUS_EFFECTS_QUERY_FN = async (dlc: string) => {
    if (!dlc) throw new Error('DLC missing');
    console.log('Fetching status effect data');
    return APIService.getLoadedStatusEffects(dlc);
};
export const LOADED_AREA_EFFECTS_QUERY_FN = async (dlc: string) => {
    if (!dlc) throw new Error('DLC missing');
    console.log('Fetching area effect data');
    return APIService.getLoadedAreaEffects(dlc);
};
export const LOADED_CHARACTERS_QUERY_FN = async (dlc: string) => {
    if (!dlc) throw new Error('DLC missing');
    console.log('Fetching character data');
    return APIService.getLoadedCharacters(dlc);
};

const useLoadedItems = (dlc: string, enabled: boolean = true) => {
    const { data, refetch, isPending, isError } = useQuery({
        enabled: enabled && !!dlc,
        queryKey: LOADED_ITEM_QUERY_KEYS(dlc),
        queryFn: async () => LOADED_ITEMS_QUERY_FN(dlc),
    });
    return {
        items: data,
        refetch,
        isPending,
        isError,
    };
};

const useLoadedWeapons = (dlc: string, enabled: boolean = true) => {
    const { data, refetch, isPending, isError } = useQuery({
        enabled: enabled && !!dlc,
        queryKey: LOADED_WEAPON_QUERY_KEYS(dlc),
        queryFn: async () => LOADED_WEAPONS_QUERY_FN(dlc),
    });
    return {
        weapons: data,
        refetch,
        isPending,
        isError,
    };
};
const useLoadedSpells = (dlc: string, enabled: boolean = true) => {
    const { data, refetch, isPending, isError } = useQuery({
        enabled: enabled && !!dlc,
        queryKey: LOADED_SPELL_QUERY_KEYS(dlc),
        queryFn: async () => LOADED_SPELLS_QUERY_FN(dlc),
    });
    return {
        spells: data,
        refetch,
        isPending,
        isError,
    };
};

const useLoadedStatusEffects = (dlc: string, enabled: boolean = true) => {
    const { data, refetch, isPending, isError } = useQuery({
        enabled: enabled && !!dlc,
        queryKey: LOADED_STATUS_EFFECT_QUERY_KEYS(dlc),
        queryFn: async () => LOADED_STATUS_EFFECTS_QUERY_FN(dlc),
    });
    return {
        statusEffects: data,
        refetch,
        isPending,
        isError,
    };
};

const useLoadedAreaEffects = (dlc: string, enabled: boolean = true) => {
    const { data, refetch, isPending, isError } = useQuery({
        enabled: enabled && !!dlc,

        queryKey: LOADED_AREA_EFFECT_QUERY_KEYS(dlc),
        queryFn: async () => LOADED_AREA_EFFECTS_QUERY_FN(dlc),
    });
    return {
        areaEffects: data,
        refetch,
        isPending,
        isError,
    };
};

const useLoadedCharacters = (dlc: string, enabled: boolean = true) => {
    const { data, refetch, isPending, isError, isSuccess } = useQuery({
        enabled: enabled && !!dlc,
        queryKey: LOADED_CHARACTER_QUERY_KEYS(dlc),
        queryFn: async () => LOADED_CHARACTERS_QUERY_FN(dlc),
    });
    return {
        characters: data,
        refetch,
        isPending,
        isError,
        isSuccess,
    };
};

export {
    useLoadedAreaEffects,
    useLoadedCharacters,
    useLoadedItems,
    useLoadedSpells,
    useLoadedStatusEffects,
    useLoadedWeapons,
};
