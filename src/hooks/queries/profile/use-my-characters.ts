import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import APIService from '@services/APIService';

export const MY_CHARACTERS_QUERY_KEYS = () => ['user', 'me', 'characters'];
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
