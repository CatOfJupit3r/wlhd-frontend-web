import APIService from '@services/APIService';
import { useQuery } from '@tanstack/react-query';

const useLoadedItems = (dlc: string, enabled: boolean = true) => {
    const { data, refetch, isPending, isError } = useQuery({
        enabled: enabled && !!dlc,
        queryKey: ['game', 'item', dlc],
        queryFn: async () => {
            if (!dlc) throw new Error('DLC missing');
            console.log('Fetching item data');
            return APIService.getLoadedItems(dlc);
        },
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
        queryKey: ['game', 'weapon', dlc],
        queryFn: async () => {
            if (!dlc) throw new Error('DLC missing');
            console.log('Fetching weapon data');
            return APIService.getLoadedWeapons(dlc);
        },
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
        queryKey: ['game', 'spell', dlc],
        queryFn: async () => {
            if (!dlc) throw new Error('DLC missing');
            console.log('Fetching spell data');
            return APIService.getLoadedSpells(dlc);
        },
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
        queryKey: ['game', 'status_effect', dlc],
        queryFn: async () => {
            if (!dlc) throw new Error('DLC missing');
            console.log('Fetching status effect data');
            return APIService.getLoadedStatusEffects(dlc);
        },
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
        queryKey: ['game', 'area_effect', dlc],
        queryFn: async () => {
            if (!dlc) throw new Error('DLC missing');
            console.log('Fetching area effect data');
            return APIService.getLoadedAreaEffects(dlc);
        },
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
        queryKey: ['game', 'character', dlc],
        queryFn: async () => {
            if (!dlc) throw new Error('DLC missing');
            console.log('Fetching character data');
            return APIService.getLoadedCharacters(dlc);
        },
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
