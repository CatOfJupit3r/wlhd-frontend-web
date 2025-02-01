import { toastError } from '@hooks/useToast';
import { iLobbyInformation } from '@models/Redux';
import APIService from '@services/APIService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRefreshLobbyPlayers = () => {
    const queryClient = useQueryClient();

    const { mutate: refreshLobbyPlayers, isPending } = useMutation({
        mutationFn: async (lobbyId: string) => {
            return APIService.getLobbyPlayers(lobbyId);
        },
        onSuccess: (data, lobbyId) => {
            if (data) {
                queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                    if (!oldData) return;
                    return { ...oldData, ...data };
                });
            }
        },
        onError: (error) => {
            toastError({
                title: 'Error',
                description: error.message ?? 'Could not refresh lobby players',
            });
        },
    });

    return {
        refreshLobbyPlayers,
        isPending,
    };
};

export default useRefreshLobbyPlayers;
