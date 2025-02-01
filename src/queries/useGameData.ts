import APIService from '@services/APIService';
import { useQuery } from '@tanstack/react-query';

const useGameItemInformation = (dlc: string, descriptor: string) => {
    const { data, refetch, isPending, isError } = useQuery({
        queryKey: ['game', 'item', dlc, descriptor],
        queryFn: async () => {
            console.log('Fetching item data');
            return APIService.getItemInformation(dlc, descriptor);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
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
        queryKey: ['game', 'weapon', dlc, descriptor],
        queryFn: async () => {
            console.log('Fetching weapon data');
            return APIService.getWeaponInformation(dlc, descriptor);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
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
        queryKey: ['game', 'spell', dlc, descriptor],
        queryFn: async () => {
            console.log('Fetching spell data');
            return APIService.getSpellInformation(dlc, descriptor);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
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
        queryKey: ['game', 'status_effect', dlc, descriptor],
        queryFn: async () => {
            console.log('Fetching status effect data');
            return APIService.getStatusEffectInformation(dlc, descriptor);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
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
        queryKey: ['game', 'character', dlc, descriptor],
        queryFn: async () => {
            console.log('Fetching character data');
            return APIService.getCharacterInformation(dlc, descriptor);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
    });
    return {
        character: data,
        refetch,
        isPending,
        isError,
    };
};

export {
    useGameItemInformation,
    useGameWeaponInformation,
    useGameSpellInformation,
    useGameStatusEffectInformation,
    useGameCharacterInformation,
};
