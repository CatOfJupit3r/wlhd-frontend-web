import { useQuery } from '@tanstack/react-query';
import { iLobbyInformation } from '@type-defs/api-data';

import { QUERY_REFETCH_INTERVALS } from '@constants/query-client';
import { useCurrentLobbyId } from '@hooks/use-current-lobby-id';
import APIService from '@services/api-service';

const DEFAULT_LOBBY_STATE: ThisLobbyQueryFnReturnType = {
    name: '',
    lobbyId: '',
    combats: [],
    players: [],
    waitingApproval: [],
    characters: [],
    gm: '',
    layout: 'default',
};

export const THIS_LOBBY_QUERY_KEYS = (lobbyId: string) => ['lobby', lobbyId];
type ThisLobbyQueryFnReturnType = Awaited<ReturnType<typeof THIS_LOBBY_QUERY_FN>>;
export const THIS_LOBBY_QUERY_FN = async (lobbyId: string) => {
    if (!lobbyId) {
        throw new Error('No lobby ID provided');
    }

    try {
        return APIService.getLobbyInfo(lobbyId);
    } catch (error) {
        console.error('Failed to fetch lobby information', error);
        throw error;
    }
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
        queryKey: THIS_LOBBY_QUERY_KEYS(lobbyId!),
        queryFn: async () => {
            return THIS_LOBBY_QUERY_FN(lobbyId!);
        },
        staleTime: QUERY_REFETCH_INTERVALS.ONE_MINUTE,
        refetchOnWindowFocus: true,
    });

    return {
        lobby: lobby ?? DEFAULT_LOBBY_STATE,
        isLoading,
        isError,
        error,
        lobbyId,
        refetch,
        isInLobbyPage: !!lobbyId,
    };
};

export default useThisLobby;
