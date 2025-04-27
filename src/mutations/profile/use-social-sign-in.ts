import { toastBetterAuthError } from '@components/toastifications';
import { AccountSocialProviders } from '@models/common-types';
import AuthService from '@services/AuthService';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

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
