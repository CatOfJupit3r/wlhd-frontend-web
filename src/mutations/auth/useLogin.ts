import { toastError } from '@components/toastifications';
import APIService from '@services/APIService';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

const useLogin = () => {
    const { t } = useTranslation('local', {
        keyPrefix: 'auth',
    });

    const { mutate, isPending } = useMutation({
        mutationFn: ({ handle, password }: { handle: string; password: string }) => {
            return APIService.login(handle, password);
        },
        onError: (err) => {
            if (err && err instanceof AxiosError) {
                toastError(t('error'), err.response?.data.message);
            } else if (err && err instanceof Error) {
                toastError(t('error'), err.message);
            }
        },
    });

    return {
        mutate,
        isPending,
    };
};

export default useLogin;
