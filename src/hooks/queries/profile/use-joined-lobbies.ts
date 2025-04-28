import { useQuery } from '@tanstack/react-query';
import { ShortLobbyInformation } from '@type-defs/api-data';
import { useMemo } from 'react';

import { USE_ME_QUERY_KEYS } from '@queries/use-me';
import APIService from '@services/api-service';

export const JOINED_LOBBIES_QUERY_KEYS = () => [...USE_ME_QUERY_KEYS(), 'joined_lobbies'];

const useJoinedLobbies = () => {
    const queryKey = useMemo(() => JOINED_LOBBIES_QUERY_KEYS(), []);

    const { data, isPending, isError } = useQuery<Array<ShortLobbyInformation>>({
        queryKey,
        queryFn: async () => {
            return APIService.getJoinedLobbies();
        },
    });
    return {
        joined: data ?? [],
        isPending,
        isError,
    };
};

export default useJoinedLobbies;
