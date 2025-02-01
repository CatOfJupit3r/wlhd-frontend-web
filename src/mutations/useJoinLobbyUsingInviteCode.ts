import { toast } from '@hooks/useToast'
import APIService from '@services/APIService'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useJoinLobbyUsingInviteCode = () => {
    const queryClient = useQueryClient()

    const { mutate, mutateAsync, isPending } = useMutation({
        mutationFn: async (inviteCode: string) => {
            return APIService.joinLobbyUsingInviteCode({ inviteCode })
        },
        onSuccess: (data) => {
            if (data) {
                console.log(data)
                queryClient.setQueryData(['user', 'me'], () => {
                    return { ...data }
                })
            }
            toast({
                title: 'Success',
                description: 'Invite code successfully used! Now, wait for the GM to approve your request.',
                position: 'top-center',
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message ?? 'Could not join lobby',
                position: 'top-center',
            })
        },
    })

    return {
        joinLobbyUsingInviteCode: mutate,
        joinLobbyUsingInviteCodeAsync: mutateAsync,
        isPending,
        isUseInviteCodePending: isPending,
    }
}

export default useJoinLobbyUsingInviteCode
