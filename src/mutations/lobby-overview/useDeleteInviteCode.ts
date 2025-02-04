import { iInviteCode } from '@models/Redux';
import APIService from '@services/APIService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeleteInviteCode = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ lobbyId, code }: { lobbyId: string; code: string }) => {
            return APIService.deleteInviteCode({ lobbyId, code });
        },
        onMutate: ({ lobbyId, code }) => {
            queryClient.setQueryData(['lobby', lobbyId, 'inviteCodes'], (oldData: Array<iInviteCode>) => {
                if (!oldData) return;
                return oldData.filter((c) => c.code !== code);
            });
        },
        onSettled: (data, _, { lobbyId }) => {
            if (!data) return;
            queryClient.setQueryData(['lobby', lobbyId, 'inviteCodes'], () => {
                return data;
            });
        },
        onError: (_, { lobbyId }) => {
            console.log(_);
            queryClient.invalidateQueries({
                queryKey: ['lobby', lobbyId, 'inviteCodes'],
            });
        },
    });

    return {
        deleteInviteCode: mutate,
        isPending,
    };
};

export default useDeleteInviteCode;
