import { ShortLobbyInformation } from '@models/APIData';
import APIService from '@services/APIService';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const DEFAULT_SHORT_INFO: ShortLobbyInformation = {
    name: '',
    isGm: false,
    _id: '',
    characters: [],
    needsApproval: true,
};

export const LOBBY_SHORT_INFO_QUERY_KEYS = (lobbyId: string) => ['lobby', lobbyId, 'short'];

const useLobbyShortInfo = (lobbyId: string, preloaded?: ShortLobbyInformation) => {
    const queryKey = useMemo(() => LOBBY_SHORT_INFO_QUERY_KEYS(lobbyId), [lobbyId]);

    const { data, isLoading, isError } = useQuery({
        queryKey,
        queryFn: async () => {
            return APIService.getShortLobbyInfo(lobbyId);
        },
        placeholderData: { ...DEFAULT_SHORT_INFO, _id: lobbyId },
        initialData: preloaded,
    });

    return {
        lobbyInfo: data || { ...DEFAULT_SHORT_INFO, _id: lobbyId },
        isLoading,
        isError,
    };
};

export default useLobbyShortInfo;
