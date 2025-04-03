import { toastError } from '@components/toastifications';
import { USE_ME_QUERY_KEYS } from '@queries/useMe';
import AuthService from '@services/AuthService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

const useLogin = () => {
    const { t } = useTranslation('local', {
        keyPrefix: 'auth',
    });
    const queryClient = useQueryClient();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) => {
            return AuthService.getInstance().signIn.username({
                username,
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

export default useLogin;
