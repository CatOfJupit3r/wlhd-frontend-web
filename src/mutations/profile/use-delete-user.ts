import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { RouterRoute } from '@type-defs/common-types';

import { toastError } from '@components/toastifications';
import { USE_ME_QUERY_KEYS } from '@queries/useMe';
import AuthService from '@services/AuthService';

const useDeleteUser = ({ to }: { to: RouterRoute }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: () => {
            return AuthService.getInstance().deleteUser();
        },
        onError: (_) => {
            toastError('Failed to delete account', 'Something went wrong during account deletion process');
        },
        onSuccess: async () => {
            await navigate({ to });
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

export default useDeleteUser;
