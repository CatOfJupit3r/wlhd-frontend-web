import { useMutation, useQueryClient } from '@tanstack/react-query';

import { iLobbyInformation } from '@models/api-data';
import APIService from '@services/APIService';

export const useApproveUserMutation = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ lobbyId, userId }: { lobbyId: string; userId: string }) => {
            return APIService.approveLobbyPlayer(lobbyId, userId);
        },
        onMutate: ({ lobbyId, userId }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) return;
                return {
                    ...oldData,
                    players: [
                        ...oldData.players,
                        {
                            nickname: oldData.waitingApproval.find((p) => p.userId === userId)?.name || '',
                            characters: [],
                            userId,
                        },
                    ],
                    waitingApproval: oldData.waitingApproval.filter((p) => p.userId !== userId),
                };
            });
        },
        onSuccess: ({ players, waitingApproval }, { lobbyId }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) return;
                return {
                    ...oldData,
                    players,
                    waitingApproval,
                };
            });
        },
        onError: (_, { lobbyId }) => {
            queryClient.invalidateQueries({
                queryKey: ['lobby', lobbyId],
            });
        },
    });

    return {
        mutate,
        isPending,
    };
};
