import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { iUserStatistics } from '@models/api-data';
import APIService from '@services/APIService';

const DEFAULT_STATISTICS: iUserStatistics = {
    characters: 0,
    lobbies: 0,
    gmLobbies: 0,
};

export const MY_STATISTICS_QUERY_KEYS = () => ['user', 'me', 'statistics'];
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
