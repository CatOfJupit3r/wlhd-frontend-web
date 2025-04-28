import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AccountSocialProviders } from '@type-defs/common-types';

import { toastBetterAuthError } from '@components/toastifications';
import AuthService from '@services/auth-service';

const useSocialSignIn = () => {
    const navigate = useNavigate();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({ provider, callbackURL }: { provider: AccountSocialProviders; callbackURL?: string }) => {
            return AuthService.getInstance().signIn.social({
                provider,
                callbackURL,
            });
        },
        onError: (e) => {
            toastBetterAuthError('Failed to login', e);
        },
        onSuccess: async (_, { callbackURL }) => {
            await navigate({ to: callbackURL });
        },
    });

    return {
        mutate,
        isPending,
        isSuccess,
    };
};

export default useSocialSignIn;
