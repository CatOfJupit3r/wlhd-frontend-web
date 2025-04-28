import { useQuery } from '@tanstack/react-query';
import { iLobbyInformation } from '@type-defs/api-data';

import { useCurrentLobbyId } from '@hooks/useCurrentLobbyId';
import APIService from '@services/api-service';

const defaultLobbyState: iLobbyInformation = {
    name: '',
    lobbyId: '',
    combats: [],
    players: [],
    waitingApproval: [],
    characters: [],
    gm: '',
    layout: 'default',
};

const useThisLobby = () => {
    const lobbyId = useCurrentLobbyId();

    const {
        data: lobby,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<iLobbyInformation>({
        enabled: !!lobbyId,

        // Unique query key based on lobby ID
        queryKey: ['lobby', lobbyId],

        queryFn: async () => {
            if (!lobbyId) {
                throw new Error('No lobby ID provided');
            }

            try {
                return APIService.getLobbyInfo(lobbyId);
            } catch (error) {
                console.error('Failed to fetch lobby information', error);
                throw error;
            }
        },

        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
        retry: 1,

        placeholderData: defaultLobbyState,
    });

    return {
        lobby: lobby ?? defaultLobbyState,
        isLoading,
        isError,
        error,
        lobbyId,
        refetch,
        isInLobbyPage: !!lobbyId,
    };
};

export default useThisLobby;
