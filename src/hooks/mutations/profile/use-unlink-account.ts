import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toastBetterAuthError } from '@components/toastifications';
import { USE_ME_QUERY_KEYS } from '@queries/use-me';
import AuthService from '@services/auth-service';

const useUnlinkAccount = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({ provider }: { provider: string }) => {
            return AuthService.getInstance().unlinkAccount({
                providerId: provider,
            });
        },
        onError: async (e) => {
            toastBetterAuthError('Failed to unlink account', e);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: USE_ME_QUERY_KEYS(),
            });
        },
    });

    return {
        mutate,
        isPending,
        isSuccess,
    };
};

export default useUnlinkAccount;
