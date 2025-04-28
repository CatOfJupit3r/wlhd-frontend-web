import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { USE_ME_QUERY_KEYS } from '@queries/use-me';
import APIService from '@services/api-service';

export const MY_CHARACTERS_QUERY_KEYS = () => [...USE_ME_QUERY_KEYS(), 'characters'];
export const MY_CHARACTERS_QUERY_FN = async () => {
    return APIService.getMyCharacters();
};

const useMyCharacters = () => {
    const queryKey = useMemo(() => MY_CHARACTERS_QUERY_KEYS(), []);

    const { data, isLoading, isError } = useQuery({
        queryKey,
        queryFn: MY_CHARACTERS_QUERY_FN,
    });

    return {
        characters: data ?? [],
        isLoading,
        isError,
    };
};

export default useMyCharacters;
