import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iInviteCode } from '@type-defs/api-data';

import { LOBBY_INVITE_CODE_QUERY_KEYS } from '@queries/lobbies/use-lobby-invite-code';
import APIService from '@services/api-service';

const useCreateInviteCode = () => {
    const queryClient = useQueryClient();

    const { mutate: createInviteCode, isPending } = useMutation({
        mutationFn: async ({ lobbyId, data }: { lobbyId: string; data: { max_uses: number; valid_for: string } }) => {
            return APIService.createInviteCode({ lobbyId, data });
        },
        onSuccess: (data, { lobbyId }) => {
            queryClient.setQueryData(LOBBY_INVITE_CODE_QUERY_KEYS(lobbyId), (oldData: Array<iInviteCode>) => {
                if (!oldData) return;
                return [...data];
            });
        },
    });

    return {
        createInviteCode,
        isPending,
    };
};

export default useCreateInviteCode;
