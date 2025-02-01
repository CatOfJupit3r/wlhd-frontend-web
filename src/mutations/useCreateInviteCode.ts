import { iInviteCode } from '@models/Redux';
import APIService from '@services/APIService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateInviteCode = () => {
    const queryClient = useQueryClient();

    const { mutate: createInviteCode, isPending } = useMutation({
        mutationFn: async ({ lobbyId, data }: { lobbyId: string; data: { max_uses: number; valid_for: string } }) => {
            return APIService.createInviteCode({ lobbyId, data });
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['lobby', variables.lobbyId, 'inviteCodes'], (oldData: Array<iInviteCode>) => {
                if (!oldData) return;
                return [...data];
            });
        },
    });

    return {
        createInviteCode,
        isPending,
    };
};

export default useCreateInviteCode;
