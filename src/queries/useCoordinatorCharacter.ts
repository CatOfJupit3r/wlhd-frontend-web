import APIService from '@services/APIService';
import { useQuery } from '@tanstack/react-query';

const useCoordinatorCharacter = (lobbyId: string, descriptor: string) => {
    const { data, refetch, isPending, isError } = useQuery({
        queryKey: ['game', 'coordinator', 'character', descriptor],
        queryFn: async () => {
            console.log('Fetching character', descriptor);
            if (!descriptor) throw new Error('No descriptor provided');
            return APIService.getCharacterInfo(lobbyId, descriptor);
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

export default useCoordinatorCharacter;
