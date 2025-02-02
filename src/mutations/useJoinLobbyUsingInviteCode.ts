import { toastError, toastInfo } from '@components/toastifications';
import APIService from '@services/APIService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useJoinLobbyUsingInviteCode = () => {
    const queryClient = useQueryClient();

    const { mutate, mutateAsync, isPending } = useMutation({
        mutationFn: async (inviteCode: string) => {
            return APIService.joinLobbyUsingInviteCode({ inviteCode });
        },
        onSuccess: (data) => {
            if (data) {
                console.log(data);
                queryClient.setQueryData(['user', 'me'], () => {
                    return { ...data };
                });
            }
            toastInfo('Success', 'Invite code successfully used! Now, wait for the GM to approve your request.'); // add translations
        },
        onError: (error) => {
            toastError('Error', error.message ?? 'Could not join lobby'); // add translations
        },
    });

    return {
        joinLobbyUsingInviteCode: mutate,
        joinLobbyUsingInviteCodeAsync: mutateAsync,
        isPending,
        isUseInviteCodePending: isPending,
    };
};

export default useJoinLobbyUsingInviteCode;
