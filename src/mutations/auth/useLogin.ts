import { toastError } from '@components/toastifications';
import authClient from '@lib/auth';
import { USE_ME_QUERY_KEYS } from '@queries/useMe';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

const useLogin = ({ shouldRedirect }: { shouldRedirect?: boolean }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'auth',
    });
    const queryClient = useQueryClient();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({ handle, password }: { handle: string; password: string }) => {
            return authClient.signIn.username({
                username: handle,
                password,
                rememberMe: true,
                fetchOptions: { throw: true },
            });
        },
        onError: (err) => {
            if (err && err instanceof AxiosError) {
                toastError(t('error'), err.response?.data.message);
            } else if ('error' in err && 'message' in (err.error as Record<string, string>)) {
                toastError(t('error'), (err.error as Record<string, string>).message);
            } else if (err && err instanceof Error) {
                toastError(t('error'), err.message);
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [...USE_ME_QUERY_KEYS],
            });
        },
    });

    return {
        mutate,
        isPending,
        isSuccess,
    };
};

export default useLogin;
