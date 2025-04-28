import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iLobbyInformation } from '@type-defs/api-data';

import { COORDINATOR_CHARACTER_QUERY_KEYS } from '@queries/game-data/use-coordinator-character';
import { THIS_LOBBY_QUERY_KEYS } from '@queries/lobbies/use-this-lobby';
import APIService from '@services/api-service';

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
            queryClient.setQueryData(THIS_LOBBY_QUERY_KEYS(lobbyId), (oldData: iLobbyInformation) => {
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
        onSuccess: ({ characters, players }, { lobbyId, descriptor }) => {
            queryClient.setQueryData(THIS_LOBBY_QUERY_KEYS(lobbyId), (oldData: iLobbyInformation) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    characters,
                    players,
                };
            });
            // we only remove character on success, because IF the character is failed to be removed, this will cause unnecessary refetches
            // but onSuccess guarantees that the character is deleted
            queryClient.removeQueries({
                queryKey: COORDINATOR_CHARACTER_QUERY_KEYS(descriptor),
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
