import { useQuery } from '@tanstack/react-query';

import AuthService, { InternalAuthSession } from '@services/AuthService';
import { useMemo } from 'react';

const PLACEHOLDER_USER: InternalAuthSession = {
    user: {
        email: '',
        name: '',
        username: '',
        displayUsername: '',
        id: '',
        updatedAt: new Date(),
        createdAt: new Date(),
        emailVerified: true,
    },
    session: {
        id: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '',
        expiresAt: new Date(),
        token: '',
    },
};

export const USE_ME_QUERY_KEYS = () => ['user', 'me'];
export const meQueryFn = async () => {
    return AuthService.getSession();
};

/**
 * Central hook for getting user information
 * It is recommended to use this hook as it caches the user information and refetches every once in a while
 */
export const useMe = () => {
    const queryKey = useMemo(() => USE_ME_QUERY_KEYS(), []);
    const { data, isPending, isError, error, refetch, isSuccess } = useQuery<InternalAuthSession>({
        queryKey,
        queryFn: meQueryFn,
        // Caching and retry configurations
        staleTime: 60 * 1000, // Data considered fresh for 1 minutes
        refetchOnWindowFocus: true, // Refetch when window regains focus
        retry: 1, // Retry once on failure
    });

    return {
        user: data?.user ?? PLACEHOLDER_USER?.user,
        session: data?.session ?? PLACEHOLDER_USER?.session,
        isLoading: isPending,
        isError,
        isSuccess,
        error,
        refetch,
        isLoggedIn: Boolean(data?.user?.id && isSuccess),
    };
};

export type UseMe = ReturnType<typeof useMe>;
export default useMe;
