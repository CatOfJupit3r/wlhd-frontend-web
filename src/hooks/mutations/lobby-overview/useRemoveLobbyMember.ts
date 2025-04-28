import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iLobbyInformation } from '@type-defs/api-data';

import APIService from '@services/APIService';

const useRemoveLobbyMember = () => {
    const queryClient = useQueryClient();

    const { mutate: removeLobbyMember, isPending } = useMutation({
        mutationFn: async ({ lobbyId, userId }: { lobbyId: string; userId: string }) => {
            return APIService.removeLobbyMember(lobbyId, userId);
        },
        onMutate: ({ lobbyId, userId }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) {
                    return oldData;
                }
                const players = oldData.players.filter((player) => player.userId !== userId);
                const waitingApproval = oldData.waitingApproval.filter((player) => player.name !== userId);
                return {
                    ...oldData,
                    players,
                    waitingApproval,
                };
            });
        },
        onError: (_, { lobbyId }) => {
            return queryClient.invalidateQueries({
                queryKey: ['lobby', lobbyId],
            });
        },
        onSuccess: ({ players, waitingApproval }, { lobbyId }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) {
                    return oldData;
                }
                return {
                    ...oldData,
                    players,
                    waitingApproval,
                };
            });
        },
    });
    return {
        removeLobbyMember,
        isPending,
    };
};

export default useRemoveLobbyMember;
