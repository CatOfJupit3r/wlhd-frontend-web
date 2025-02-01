import { CharacterClassConversion } from '@models/EditorConversion';
import APIService from '@services/APIService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
