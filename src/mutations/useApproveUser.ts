import { iLobbyInformation } from '@models/Redux';
import APIService from '@services/APIService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useApproveUserMutation = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ lobbyId, handle }: { lobbyId: string; handle: string }) => {
            // APIService.approveLobbyPlayer(lobbyId, handle)
            // request returns users
            return APIService.approveLobbyPlayer(lobbyId, handle);
        },
        onMutate: ({ lobbyId, handle }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) return;
                return {
                    ...oldData,
                    players: [
                        ...oldData.players,
                        {
                            nickname: handle,
                            handle,
                            characters: [],
                            userId: '',
                        },
                    ],
                    waitingApproval: oldData.waitingApproval.filter((p) => p.handle !== handle),
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
