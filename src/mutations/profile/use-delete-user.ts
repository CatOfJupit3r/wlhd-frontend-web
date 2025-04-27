import { toastError } from '@components/toastifications';
import { RouterRoute } from '@models/common-types';
import { USE_ME_QUERY_KEYS } from '@queries/useMe';
import AuthService from '@services/AuthService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

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
