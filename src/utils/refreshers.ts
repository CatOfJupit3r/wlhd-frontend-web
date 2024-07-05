import APIService from '@services/APIService'
import { setLobbyInfo } from '@redux/slices/lobbySlice'
import { store as ReduxStore } from '@redux/store'
import { fetchUserInformation } from '@redux/slices/cosmeticsSlice'
import AuthManager from '@services/AuthManager'

export const refreshLobbyInfo = async (lobbyId: string | undefined) => {
    if (!lobbyId) {
        return
    }

    let response
    try {
        response = await APIService.getLobbyInfo(lobbyId || '')
    } catch (error) {
        console.log(error)
        return
    }
    if (response) {
        ReduxStore.dispatch(setLobbyInfo(response))
    }
}

export const refreshUserInfo = () => {
    if (!AuthManager.getAccessToken()) {
        return
    }
    ReduxStore.dispatch(fetchUserInformation())
}
