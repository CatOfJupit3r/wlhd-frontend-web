import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import { toastError } from '@components/toastifications';
import queryClient from '@constants/query-client';
import { USE_ME_QUERY_KEYS } from '@queries/use-me';
import AuthService from '@services/auth-service';

const useRegister = () => {
    const { t } = useTranslation('local');

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) => {
            return AuthService.getInstance().signUp.email({
                email: `${username}@example.com`,
                name: username,
                username,
                password,
                fetchOptions: { throw: true },
            });
        },
        onError: (err) => {
            if (err && err instanceof AxiosError) {
                toastError(t('error'), err.response?.data.message);
            } else if (err && err instanceof Error) {
                toastError(t('error'), err.message);
            }
        },
        onSuccess: async (_) => {
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

export default useRegister;
