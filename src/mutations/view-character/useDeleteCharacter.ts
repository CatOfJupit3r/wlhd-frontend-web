import { useMutation, useQueryClient } from '@tanstack/react-query';

import { iLobbyInformation } from '@models/Redux';
import APIService from '@services/APIService';

const useDeleteCharacter = () => {
    const queryClient = useQueryClient();

    const {
        mutate: deleteCharacter,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: async ({ lobbyId, descriptor }: { lobbyId: string; descriptor: string }) => {
            return APIService.deleteCharacter(lobbyId, descriptor);
        },
        onMutate: ({ lobbyId, descriptor }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    characters: oldData.characters.filter((c) => c.descriptor !== descriptor),
                    players: oldData.players.map((p) => {
                        if (p.characters.some(([d]) => d === descriptor)) {
                            return {
                                ...p,
                                characters: p.characters.filter(([d]) => d !== descriptor),
                            };
                        }
                        return p;
                    }),
                };
            });
        },
        onError: (error) => {
            console.error('Error deleting character', error);
        },
        onSuccess: ({ characters, players }, { lobbyId }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    characters,
                    players,
                };
            });
        },
    });
    return {
        deleteCharacter,
        isPending,
        isSuccess,
    };
};

export default useDeleteCharacter;
