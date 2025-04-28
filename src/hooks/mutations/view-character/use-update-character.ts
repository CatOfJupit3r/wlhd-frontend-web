import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CharacterClassConversion } from '@type-defs/editors-conversion';

import { COORDINATOR_CHARACTER_QUERY_KEYS } from '@queries/game-data/use-coordinator-character';
import APIService from '@services/api-service';

const useUpdateCharacter = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async ({
            character,
            lobbyId,
            descriptor,
        }: {
            character: CharacterClassConversion;
            lobbyId: string;
            descriptor: string;
        }) => {
            return APIService.updateCharacter(lobbyId, descriptor, character);
        },
        onSettled: (_, __, { descriptor }) => {
            queryClient.invalidateQueries({
                queryKey: COORDINATOR_CHARACTER_QUERY_KEYS(descriptor),
            });
        },
    });

    return {
        updateCharacter: mutate,
        isPending,
    };
};

export default useUpdateCharacter;
