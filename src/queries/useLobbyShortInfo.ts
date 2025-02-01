import { ShortLobbyInformation } from '@models/APIData'
import APIService from '@services/APIService'
import { useQuery } from '@tanstack/react-query'

const DEFAULT_SHORT_INFO: ShortLobbyInformation = {
    name: '',
    isGm: false,
    _id: '',
    characters: [],
    needsApproval: true,
}

const useLobbyShortInfo = (lobbyId: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['lobby', lobbyId, 'short'],
        queryFn: async () => {
            return APIService.getShortLobbyInfo(lobbyId)
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
        placeholderData: { ...DEFAULT_SHORT_INFO, _id: lobbyId },
    })

    return {
        lobbyInfo: data || { ...DEFAULT_SHORT_INFO, _id: lobbyId },
        isLoading,
        isError,
    }
}

export default useLobbyShortInfo
