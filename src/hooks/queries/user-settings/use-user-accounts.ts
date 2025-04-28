import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { USE_ME_QUERY_KEYS } from '@queries/use-me';
import AuthService from '@services/auth-service';

export type UserAccountsReturnType = Awaited<ReturnType<typeof USER_ACCOUNTS_QUERY_FN>>;
const DEFAULT_DATA: UserAccountsReturnType = [];

export const USER_ACCOUNTS_QUERY_KEYS = () => [...USE_ME_QUERY_KEYS(), 'settings', 'all-accounts'];
export const USER_ACCOUNTS_QUERY_FN = async () => {
    return AuthService.getInstance().listAccounts();
};

const useUserAccounts = () => {
    const queryKey = useMemo(() => USER_ACCOUNTS_QUERY_KEYS(), []);

    const { data, isPending, isError } = useQuery({
        queryKey,
        queryFn: USER_ACCOUNTS_QUERY_FN,
    });

    return {
        accounts: data ?? DEFAULT_DATA,
        isPending,
        isError,
    };
};

export default useUserAccounts;
