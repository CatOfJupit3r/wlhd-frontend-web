import { fetchUserInformation } from '@redux/slices/cosmeticsSlice'
import { setLobbyInfo } from '@redux/slices/lobbySlice'
import { store as ReduxStore } from '@redux/store'
import APIService from '@services/APIService'
import AuthManager from '@services/AuthManager'

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

export const refreshUserInfo = () => {
    if (!AuthManager.getAccessToken()) {
        return
    }
    const state = ReduxStore.getState()
    if (state.cosmetics.user.loading === 'pending' || state.cosmetics.user.loading === 'fulfilled') {
        return
    }
    ReduxStore.dispatch(fetchUserInformation())
}
