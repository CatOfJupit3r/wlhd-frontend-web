import { iLobbyInformation } from '@models/Redux';
import APIService from '@services/APIService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useApproveUserMutation = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ lobbyId, username }: { lobbyId: string; username: string }) => {
            return APIService.approveLobbyPlayer(lobbyId, username);
        },
        onMutate: ({ lobbyId, username }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) return;
                return {
                    ...oldData,
                    players: [
                        ...oldData.players,
                        {
                            nickname: username,
                            username,
                            characters: [],
                            userId: '',
                        },
                    ],
                    waitingApproval: oldData.waitingApproval.filter((p) => p.username !== username),
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
