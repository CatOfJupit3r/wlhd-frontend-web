import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toastBetterAuthError } from '@components/toastifications';
import { MeQueryResultType, USE_ME_QUERY_KEYS } from '@queries/use-me';
import { MeExtraQueryResultType, USE_ME_EXTRA_QUERY_KEYS } from '@queries/use-me-extra';
import APIService from '@services/api-service';

export const USE_UPDATE_USER_INFO_MUTATION_FN = () => {
    return APIService.patchUserData;
};

const useUpdateUserInfo = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: USE_UPDATE_USER_INFO_MUTATION_FN(),
        onError: (e) => {
            toastBetterAuthError('Failed to update user info', e);
            queryClient.invalidateQueries({
                queryKey: USE_ME_QUERY_KEYS(),
            });
            queryClient.invalidateQueries({
                queryKey: USE_ME_EXTRA_QUERY_KEYS(),
            });
        },
        onSuccess: ({ name, colors }) => {
            queryClient.setQueryData(USE_ME_QUERY_KEYS(), (prev: MeQueryResultType) => ({
                ...prev,
                user: {
                    ...prev.user,
                    name,
                },
            }));
            queryClient.setQueryData(USE_ME_EXTRA_QUERY_KEYS(), (prev: MeExtraQueryResultType) => ({
                ...prev,
                colors,
            }));
        },
    });

    return {
        mutate,
        isPending,
    };
};

export default useUpdateUserInfo;
