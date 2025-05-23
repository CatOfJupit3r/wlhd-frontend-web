import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toastBetterAuthError } from '@components/toastifications';
import { USE_ME_QUERY_KEYS } from '@queries/use-me';
import AuthService from '@services/auth-service';

const useChangePassword = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({
            currentPassword,
            newPassword,
            revokeOtherSessions,
        }: {
            currentPassword: string;
            newPassword: string;
            revokeOtherSessions: boolean;
        }) => {
            return AuthService.getInstance().changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions,
            });
        },
        onError: async (e) => {
            toastBetterAuthError('Failed to change password', e);
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

export default useChangePassword;
