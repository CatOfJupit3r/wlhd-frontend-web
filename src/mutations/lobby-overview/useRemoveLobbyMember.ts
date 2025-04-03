import { iLobbyInformation } from '@models/Redux';
import APIService from '@services/APIService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRemoveLobbyMember = () => {
    const queryClient = useQueryClient();

    const { mutate: removeLobbyMember, isPending } = useMutation({
        mutationFn: async ({ lobbyId, username }: { lobbyId: string; username: string }) => {
            return APIService.removeLobbyMember(lobbyId, username);
        },
        onMutate: ({ lobbyId, username }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) {
                    return oldData;
                }
                const players = oldData.players.filter((player) => player.username !== username);
                const waitingApproval = oldData.waitingApproval.filter((player) => player.username !== username);
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
