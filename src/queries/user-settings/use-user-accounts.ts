import AuthService from '@services/AuthService';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type UserAccountsReturnType = Awaited<ReturnType<typeof USER_ACCOUNTS_QUERY_FN>>;
const DEFAULT_DATA: UserAccountsReturnType = [];

export const USER_ACCOUNTS_QUERY_KEYS = () => ['user', 'me', 'settings', 'all-accounts'];
export const USER_ACCOUNTS_QUERY_FN = async () => {
    return AuthService.getInstance().listAccounts({
        fetchOptions: { throw: true },
    });
};

const useUserAccounts = () => {
    const queryKey = useMemo(() => USER_ACCOUNTS_QUERY_KEYS(), []);

    const { data, isLoading, isError } = useQuery({
        queryKey,
        queryFn: USER_ACCOUNTS_QUERY_FN,
    });

    return {
        accounts: data ?? DEFAULT_DATA,
        isLoading,
        isError,
    };
};

export default useUserAccounts;
