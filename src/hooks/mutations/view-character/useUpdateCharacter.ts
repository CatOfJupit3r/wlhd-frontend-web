import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CharacterClassConversion } from '@type-defs/EditorConversion';

import APIService from '@services/APIService';

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
                queryKey: ['game', 'coordinator', 'character', descriptor],
            });
        },
    });

    return {
        updateCharacter: mutate,
        isPending,
    };
};

export default useUpdateCharacter;
