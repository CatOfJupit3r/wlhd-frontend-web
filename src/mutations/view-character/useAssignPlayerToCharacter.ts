import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iLobbyInformation } from '@type-defs/api-data';

import { toastError } from '@components/toastifications';
import APIService from '@services/APIService';

const useAssignPlayerToCharacter = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ lobbyId, descriptor, playerId }: { lobbyId: string; descriptor: string; playerId: string }) => {
            return APIService.assignPlayerToCharacter(lobbyId, descriptor, playerId);
        },
        onMutate: ({ lobbyId, descriptor, playerId }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) {
                    return oldData;
                }
                const { players } = oldData;
                return {
                    ...oldData,
                    players: players.map((p) =>
                        p.userId === playerId
                            ? {
                                  ...p,
                                  characters: [descriptor, descriptor],
                              }
                            : p,
                    ),
                };
            });
        },
        onSuccess: ({ players, characters }, { lobbyId }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) {
                    return oldData;
                }
                return {
                    ...oldData,
                    players,
                    characters,
                };
            });
        },
        onError: (err, { lobbyId }) => {
            if (err && err instanceof Error) {
                toastError('Error assigning player to character', err.message);
            }
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

export default useAssignPlayerToCharacter;
