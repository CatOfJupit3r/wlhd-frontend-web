import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SocialProvider } from 'better-auth/social-providers';

import { toastBetterAuthError } from '@components/toastifications';
import { USE_ME_QUERY_KEYS } from '@queries/useMe';
import AuthService from '@services/AuthService';

const useLinkAccount = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({ provider }: { provider: SocialProvider }) => {
            return AuthService.getInstance().linkSocial({
                provider,
                callbackURL: window.location.href,
            });
        },
        onError: async (e) => {
            toastBetterAuthError('Failed to link account', e);
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

export default useLinkAccount;
