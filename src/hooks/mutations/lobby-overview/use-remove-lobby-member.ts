import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iLobbyInformation } from '@type-defs/api-data';

import { THIS_LOBBY_QUERY_KEYS } from '@queries/lobbies/use-this-lobby';
import APIService from '@services/api-service';

const useRemoveLobbyMember = () => {
    const queryClient = useQueryClient();

    const { mutate: removeLobbyMember, isPending } = useMutation({
        mutationFn: async ({ lobbyId, userId }: { lobbyId: string; userId: string }) => {
            return APIService.removeLobbyMember(lobbyId, userId);
        },
        onMutate: ({ lobbyId, userId }) => {
            queryClient.setQueryData(THIS_LOBBY_QUERY_KEYS(lobbyId), (oldData: iLobbyInformation) => {
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
                queryKey: THIS_LOBBY_QUERY_KEYS(lobbyId),
            });
        },
        onSuccess: ({ players, waitingApproval }, { lobbyId }) => {
            queryClient.setQueryData(THIS_LOBBY_QUERY_KEYS(lobbyId), (oldData: iLobbyInformation) => {
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
