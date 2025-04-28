import { useQuery } from '@tanstack/react-query';

import { GAME_CHARACTER_INFORMATION_QUERY_KEYS } from '@queries/game-data/use-game-data';
import APIService from '@services/api-service';

export const COORDINATOR_CHARACTER_QUERY_KEYS = (descriptor: string) => [
    ...GAME_CHARACTER_INFORMATION_QUERY_KEYS('coordinator', 'character'),
    descriptor,
];

export const COORDINATOR_CHARACTER_QUERY_FN = async (lobbyId: string, descriptor: string) => {
    if (!descriptor) throw new Error('No descriptor provided');
    console.log('Fetching character', descriptor);
    return APIService.getCharacterInfo(lobbyId, descriptor);
};

const useCoordinatorCharacter = (lobbyId: string, descriptor: string, enabled: boolean = true) => {
    const { data, refetch, isPending, isError, isSuccess } = useQuery({
        enabled: enabled && !!lobbyId && !!descriptor,
        queryKey: COORDINATOR_CHARACTER_QUERY_KEYS(descriptor),
        queryFn: async () => COORDINATOR_CHARACTER_QUERY_FN(lobbyId, descriptor),
    });
    return {
        character: data,
        refetch,
        isPending,
        isError,
        isSuccess,
    };
};

export default useCoordinatorCharacter;
