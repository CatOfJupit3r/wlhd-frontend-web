import { ShortLobbyInformation } from '@models/APIData';
import APIService from '@services/APIService';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const JOINED_LOBBIES_QUERY_KEYS = () => ['joined_lobbies'];

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
