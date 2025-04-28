import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iLobbyInformation } from '@type-defs/api-data';

import { THIS_LOBBY_QUERY_KEYS } from '@queries/lobbies/use-this-lobby';
import APIService from '@services/api-service';

export const useApproveUserMutation = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ lobbyId, userId }: { lobbyId: string; userId: string }) => {
            return APIService.approveLobbyPlayer(lobbyId, userId);
        },
        onMutate: ({ lobbyId, userId }) => {
            queryClient.setQueryData(THIS_LOBBY_QUERY_KEYS(lobbyId), (oldData: iLobbyInformation) => {
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
            queryClient.setQueryData(THIS_LOBBY_QUERY_KEYS(lobbyId), (oldData: iLobbyInformation) => {
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
                queryKey: THIS_LOBBY_QUERY_KEYS(lobbyId),
            });
        },
    });

    return {
        mutate,
        isPending,
    };
};
