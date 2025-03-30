import { useQuery } from '@tanstack/react-query';

import authClient from '@lib/auth';
import { createAuthClient } from 'better-auth/react';

export type AuthClient = Omit<ReturnType<typeof createAuthClient>, 'signUp'>;
type LibSessionData = AuthClient['$Infer']['Session'];
type LibUserData = LibSessionData['user'];

interface CustomUserFields extends LibUserData {
    joined: Array<string>;
    username: string;
    displayUsername: string;
}

interface UserInformation {
    user: CustomUserFields;
    session: LibSessionData['session'];
}

const PLACEHOLDER_USER: UserInformation = {
    user: {
        email: '',
        name: '',
        username: '',
        displayUsername: '',
        id: '',
        updatedAt: new Date(),
        createdAt: new Date(),
        emailVerified: true,
        joined: [],
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

export const USE_ME_QUERY_KEYS = ['user', 'me'];
export const meQueryFn = async (): Promise<UserInformation> => {
    console.log('meQueryFn');
    // @ts-expect-error asdas das
    return authClient.getSession({ fetchOptions: { throw: true } });
};

// Custom hook for fetching user information
export const useMe = () => {
    const { data, isPending, isError, error, refetch, isSuccess, isFetched } = useQuery<UserInformation>({
        // enabled: () => AuthManager.isLoggedIn(),
        queryKey: [...USE_ME_QUERY_KEYS],

        // Query function to fetch user data
        queryFn: meQueryFn,
        // Caching and retry configurations
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
        refetchOnWindowFocus: true, // Refetch when window regains focus
        retry: 1, // Retry once on failure
    });

    console.log(Boolean(data?.user?.id && isSuccess), data?.user?.id, isFetched, isSuccess);

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
