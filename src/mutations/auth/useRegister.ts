import { toastError } from '@components/toastifications';
import authClient from '@lib/auth';
import queryClient from '@queries/QueryClient';
import { USE_ME_QUERY_KEYS } from '@queries/useMe';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

const useRegister = () => {
    const { t } = useTranslation('local');

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: ({ handle, password }: { handle: string; password: string }) => {
            return authClient.signUp.email({
                email: `${handle}@example.com`,
                name: handle,
                username: handle,
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

export default useRegister;
