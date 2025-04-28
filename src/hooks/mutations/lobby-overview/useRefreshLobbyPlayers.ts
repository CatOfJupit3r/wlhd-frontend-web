import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iLobbyInformation } from '@type-defs/api-data';

import { toastError } from '@components/toastifications';
import APIService from '@services/APIService';

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
            toastError('Error', error.message ?? 'Could not refresh lobby players');
        },
    });

    return {
        refreshLobbyPlayers,
        isPending,
    };
};

export default useRefreshLobbyPlayers;
