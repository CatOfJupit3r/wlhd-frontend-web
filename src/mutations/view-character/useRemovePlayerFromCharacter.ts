import { toastError } from '@components/toastifications';
import { iLobbyInformation } from '@models/Redux';
import APIService from '@services/APIService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useRemovePlayerFromCharacter = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({
            lobbyId,
            descriptor,
            playerId,
        }: {
            lobbyId: string;
            descriptor: string;
            playerId: string;
        }) => {
            return APIService.removePlayerFromCharacter(lobbyId, descriptor, playerId);
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
                                  characters: p.characters.filter(([c]) => c !== descriptor),
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
                toastError('Error removing player from character', err.message);
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

export default useRemovePlayerFromCharacter;
