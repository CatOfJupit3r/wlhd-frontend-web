import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iInviteCode } from '@type-defs/api-data';

import { LOBBY_INVITE_CODE_QUERY_KEYS } from '@queries/lobbies/use-lobby-invite-code';
import APIService from '@services/api-service';

const useDeleteInviteCode = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ lobbyId, code }: { lobbyId: string; code: string }) => {
            return APIService.deleteInviteCode({ lobbyId, code });
        },
        onMutate: ({ lobbyId, code }) => {
            queryClient.setQueryData(LOBBY_INVITE_CODE_QUERY_KEYS(lobbyId), (oldData: Array<iInviteCode>) => {
                if (!oldData) return;
                return oldData.filter((c) => c.code !== code);
            });
        },
        onSettled: (data, _, { lobbyId }) => {
            if (!data) return;
            queryClient.setQueryData(LOBBY_INVITE_CODE_QUERY_KEYS(lobbyId), () => {
                return data;
            });
        },
        onError: (_, { lobbyId }) => {
            queryClient.invalidateQueries({
                queryKey: LOBBY_INVITE_CODE_QUERY_KEYS(lobbyId),
            });
        },
    });

    return {
        deleteInviteCode: mutate,
        isPending,
    };
};

export default useDeleteInviteCode;
