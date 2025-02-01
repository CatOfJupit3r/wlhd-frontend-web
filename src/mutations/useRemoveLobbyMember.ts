import { iLobbyInformation } from '@models/Redux'
import APIService from '@services/APIService'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useRemoveLobbyMember = () => {
    const queryClient = useQueryClient()

    const { mutate: removeLobbyMember, isPending } = useMutation({
        mutationFn: async ({ lobbyId, handle }: { lobbyId: string; handle: string }) => {
            return APIService.removeLobbyMember(lobbyId, handle)
        },
        onMutate: ({ lobbyId, handle }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) {
                    return oldData
                }
                const players = oldData.players.filter((player) => player.handle !== handle)
                const waitingApproval = oldData.waitingApproval.filter((player) => player.handle !== handle)
                return {
                    ...oldData,
                    players,
                    waitingApproval,
                }
            })
        },
        onError: (_, { lobbyId }) => {
            queryClient.invalidateQueries({
                queryKey: ['lobby', lobbyId],
            })
        },
        onSuccess: ({ players, waitingApproval }, { lobbyId }) => {
            queryClient.setQueryData(['lobby', lobbyId], (oldData: iLobbyInformation) => {
                if (!oldData) {
                    return oldData
                }
                return {
                    ...oldData,
                    players,
                    waitingApproval,
                }
            })
        },
    })
    return {
        removeLobbyMember,
        isPending,
    }
}

export default useRemoveLobbyMember
