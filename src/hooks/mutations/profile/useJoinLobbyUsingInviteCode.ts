import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toastError, toastInfo } from '@components/toastifications';
import { JOINED_LOBBIES_QUERY_KEYS } from '@queries/profile/useJoinedLobbies';
import APIService from '@services/APIService';

const useJoinLobbyUsingInviteCode = () => {
    const queryClient = useQueryClient();

    const { mutate, mutateAsync, isPending } = useMutation({
        mutationFn: async (inviteCode: string) => {
            return APIService.joinLobbyUsingInviteCode({ inviteCode });
        },
        onSuccess: (data) => {
            if (data) {
                queryClient.setQueryData(JOINED_LOBBIES_QUERY_KEYS(), () => {
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
