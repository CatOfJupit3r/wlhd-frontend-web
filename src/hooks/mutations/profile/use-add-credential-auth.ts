import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toastBetterAuthError } from '@components/toastifications';
import { USE_ME_QUERY_KEYS } from '@queries/use-me';
import { USER_ACCOUNTS_QUERY_KEYS } from '@queries/user-settings/use-user-accounts';
import APIService from '@services/api-service';

const useAddCredentialAuth = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) => {
            return APIService.addCredentialAuth({ username, password });
        },
        onError: async (e) => {
            await queryClient.invalidateQueries({
                queryKey: USE_ME_QUERY_KEYS(),
            });
            toastBetterAuthError('Failed to add credential-based authorization', e);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: USER_ACCOUNTS_QUERY_KEYS(),
            });
        },
    });

    return {
        mutate,
        isPending,
        isSuccess,
    };
};

export default useAddCredentialAuth;
