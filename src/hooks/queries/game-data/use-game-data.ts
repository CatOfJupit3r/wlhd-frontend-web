import { useQuery } from '@tanstack/react-query';

import { LOADED_CHARACTER_QUERY_KEYS, LOADED_ITEM_QUERY_KEYS } from '@queries/game-data/use-loaded-game-data';
import APIService from '@services/api-service';

export const GAME_ITEM_INFORMATION_QUERY_KEYS = (dlc: string, descriptor: string) => [
    ...LOADED_ITEM_QUERY_KEYS(dlc),
    descriptor,
];

export const GAME_WEAPON_INFORMATION_QUERY_KEYS = (dlc: string, descriptor: string) => [
    ...LOADED_ITEM_QUERY_KEYS(dlc),
    descriptor,
];

export const GAME_SPELL_INFORMATION_QUERY_KEYS = (dlc: string, descriptor: string) => [
    ...LOADED_ITEM_QUERY_KEYS(dlc),
    descriptor,
];
export const GAME_STATUS_EFFECT_INFORMATION_QUERY_KEYS = (dlc: string, descriptor: string) => [
    ...LOADED_ITEM_QUERY_KEYS(dlc),
    descriptor,
];

export const GAME_CHARACTER_INFORMATION_QUERY_KEYS = (dlc: string, descriptor: string) => [
    ...LOADED_CHARACTER_QUERY_KEYS(dlc),
    descriptor,
];

export const GAME_AREA_EFFECT_INFORMATION_QUERY_KEYS = (dlc: string, descriptor: string) => [
    ...LOADED_ITEM_QUERY_KEYS(dlc),
    descriptor,
];

const useGameItemInformation = (dlc: string, descriptor: string) => {
    const { data, refetch, isPending, isError } = useQuery({
        queryKey: GAME_ITEM_INFORMATION_QUERY_KEYS(dlc, descriptor),
        queryFn: async () => {
            console.log('Fetching item data');
            return APIService.getItemInformation(dlc, descriptor);
        },
    });
    return {
        item: data,
        refetch,
        isPending,
        isError,
    };
};

const useGameWeaponInformation = (dlc: string, descriptor: string) => {
    const { data, refetch, isPending, isError } = useQuery({
        queryKey: GAME_WEAPON_INFORMATION_QUERY_KEYS(dlc, descriptor),
        queryFn: async () => {
            console.log('Fetching weapon data');
            return APIService.getWeaponInformation(dlc, descriptor);
        },
    });
    return {
        weapon: data,
        refetch,
        isPending,
        isError,
    };
};

const useGameSpellInformation = (dlc: string, descriptor: string) => {
    const { data, refetch, isPending, isError } = useQuery({
        queryKey: GAME_SPELL_INFORMATION_QUERY_KEYS(dlc, descriptor),
        queryFn: async () => {
            console.log('Fetching spell data');
            return APIService.getSpellInformation(dlc, descriptor);
        },
    });
    return {
        spell: data,
        refetch,
        isPending,
        isError,
    };
};

const useGameStatusEffectInformation = (dlc: string, descriptor: string) => {
    const { data, refetch, isPending, isError } = useQuery({
        queryKey: GAME_STATUS_EFFECT_INFORMATION_QUERY_KEYS(dlc, descriptor),
        queryFn: async () => {
            console.log('Fetching status effect data');
            return APIService.getStatusEffectInformation(dlc, descriptor);
        },
    });
    return {
        statusEffect: data,
        refetch,
        isPending,
        isError,
    };
};

const useGameCharacterInformation = (dlc: string, descriptor: string, enabled: boolean = true) => {
    const { data, refetch, isPending, isError } = useQuery({
        enabled: enabled && !!dlc && !!descriptor,
        queryKey: GAME_CHARACTER_INFORMATION_QUERY_KEYS(dlc, descriptor),
        queryFn: async () => {
            console.log('Fetching character data');
            return APIService.getCharacterInformation(dlc, descriptor);
        },
    });
    return {
        character: data,
        refetch,
        isPending,
        isError,
    };
};

const useGameAreaEffectInformation = (dlc: string, descriptor: string) => {
    const { data, refetch, isPending, isError } = useQuery({
        queryKey: GAME_AREA_EFFECT_INFORMATION_QUERY_KEYS(dlc, descriptor),
        queryFn: async () => {
            console.log('Fetching area effect data');
            return APIService.getAreaEffectInformation(dlc, descriptor);
        },
    });
    return {
        areaEffect: data,
        refetch,
        isPending,
        isError,
    };
};

export {
    useGameAreaEffectInformation,
    useGameCharacterInformation,
    useGameItemInformation,
    useGameSpellInformation,
    useGameStatusEffectInformation,
    useGameWeaponInformation,
};
