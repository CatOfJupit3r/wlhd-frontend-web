import { useQuery } from '@tanstack/react-query';
import { iUserStatistics } from '@type-defs/api-data';
import { useMemo } from 'react';

import { USE_ME_QUERY_KEYS } from '@queries/use-me';
import APIService from '@services/api-service';

const DEFAULT_STATISTICS: iUserStatistics = {
    characters: 0,
    lobbies: 0,
    gmLobbies: 0,
};

export const MY_STATISTICS_QUERY_KEYS = () => [...USE_ME_QUERY_KEYS(), 'statistics'];
export const MY_STATISTICS_QUERY_FN = async () => {
    return APIService.getMyStatistics();
};

const useMyStatistics = () => {
    const queryKey = useMemo(() => MY_STATISTICS_QUERY_KEYS(), []);

    const { data, isLoading, isError } = useQuery({
        queryKey,
        queryFn: MY_STATISTICS_QUERY_FN,
        staleTime: 60 * 1000, // Data considered fresh for 1 minutes
    });

    return {
        statistics: data ?? DEFAULT_STATISTICS,
        isLoading,
        isError,
    };
};

export default useMyStatistics;
