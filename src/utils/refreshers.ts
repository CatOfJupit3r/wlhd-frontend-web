import { setLobbyInfo } from '@redux/slices/lobbySlice'
import { store as ReduxStore } from '@redux/store'
import APIService from '@services/APIService'

export const refreshLobbyInfo = async (lobbyId: string | undefined) => {
    if (!lobbyId) {
        return
    }

    let response
    try {
        response = await APIService.getLobbyInfo(lobbyId)
    } catch (error) {
        console.log(error)
        return
    }
    if (response) {
        ReduxStore.dispatch(setLobbyInfo(response))
    }
}
