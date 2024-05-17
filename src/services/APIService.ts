import axios, { AxiosError } from 'axios'

import { REACT_APP_BACKEND_URL } from '../config'
import { CharacterInfo } from '../models/CharacterInfo'
import { TranslationJSON } from '../models/Translation'
import { LobbyInfo } from '../redux/slices/lobbySlice'
import AuthManager from './AuthManager'

const errors = {
    TOKEN_EXPIRED: 'Your session expired. Please login again',
}

class APIService {
    private endpoints = {
        LOGIN: `${REACT_APP_BACKEND_URL}/login`,
        LOGOUT: `${REACT_APP_BACKEND_URL}/logout`,
        REGISTER: `${REACT_APP_BACKEND_URL}/register`,
        REFRESH_TOKEN: `${REACT_APP_BACKEND_URL}/token`,

        GET_TRANSLATIONS: (languages: Array<string>, dlcs: Array<string>) =>
            `${REACT_APP_BACKEND_URL}/translations?dlc=${dlcs.join(',')}&language=${languages.join(',')}`,
    }

    private injectResponseMessageToError = (error: AxiosError) => {
        if (!error.response) return
        const message = (error.response?.data as any).message
        if (typeof message === 'string') error.message = message
    }

    private fetch = async ({
        url,
        method,
        data,
        _retry,
    }: {
        url: string
        method: 'get' | 'post' | 'put' | 'delete'
        data?: {
            [key: string]: any
        }
        _retry?: boolean
    }): Promise<{ [key: string]: any }> => {
        console.log('Checking token expiration')
        if (AuthManager.isAccessTokenExpired()) {
            console.log('Token is expired')
            await this.tryRefreshingTokenOrLogoutAndThrow()
        }
        try {
            console.log('Fetching the API...', url)
            const result = await axios(url, {
                method,
                headers: {
                    Authorization: AuthManager.getAccessToken(),
                },
                data,
            })
            console.log('Fetch succeeded', url)
            return result.data
        } catch (error: unknown) {
            if (!(error instanceof AxiosError)) throw error
            if (error.response && error.response.status === 401) {
                console.log('Received Unauthorized error from server')
                if (_retry) {
                    console.log('The request has already been retried, so we logout')
                    await this.logout()
                    throw new Error(errors.TOKEN_EXPIRED)
                } else {
                    console.log('Trying to refresh the access token')
                    await this.tryRefreshingTokenOrLogoutAndThrow()
                    console.log('Retrying original request with new access token', url)
                    const retryData = await this.fetch({
                        url,
                        method,
                        data,
                        _retry: true,
                    })

                    console.log('Retry succeeded!', url)
                    return retryData
                }
            } else {
                this.injectResponseMessageToError(error)
                throw error
            }
        }
    }

    private tryRefreshingTokenOrLogoutAndThrow = async () => {
        try {
            console.log('Refreshing token')
            await this.refreshToken()
            console.log('Token successfully refreshed')
        } catch (error) {
            console.log('Error refreshing token', error)
            console.log('Logging out user.')
            // error refreshing token
            await this.logout()
            throw new Error(errors.TOKEN_EXPIRED)
        }
    }

    public refreshToken = async () => {
        const refreshToken = AuthManager.getRefreshToken()
        const {
            data: { accessToken },
        } = await axios({
            url: this.endpoints.REFRESH_TOKEN,
            method: 'post',
            data: { token: refreshToken },
        })
        AuthManager.setAccessToken(accessToken)
    }

    public logout = async () => {
        AuthManager.logout()
        const refreshToken = AuthManager.getRefreshToken()
        if (refreshToken) {
            return axios({
                url: this.endpoints.LOGOUT,
                method: 'post',
                data: { token: refreshToken },
            })
        }
        return null
    }

    public login = async (handle: string, password: string) => {
        const response = await axios.post(this.endpoints.LOGIN, { handle, password })
        const { accessToken, refreshToken } = response.data
        AuthManager.login({ accessToken, refreshToken })
    }

    public createAccount = async (handle: string, password: string) => {
        await axios.post(this.endpoints.REGISTER, { handle, password })
        await this.login(handle, password)
    }

    public getTranslations = async (languages: Array<string>, dlcs: Array<string>): Promise<TranslationJSON> => {
        try {
            return await this.fetch({
                url: this.endpoints.GET_TRANSLATIONS(languages, dlcs),
                method: 'get',
            })
        } catch (e) {
            console.log(e)
            return {}
        }
    }

    public getLobbyInfo = async (lobby_id: string): Promise<LobbyInfo> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}`,
            method: 'get',
        })) as LobbyInfo
    }

    public getCharacterInfo = async (character_id: string, lobby_id: string): Promise<CharacterInfo> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/character/${character_id}`,
            method: 'get',
        })) as CharacterInfo
    }

    public getMyCharacterInfo = async (lobby_id: string): Promise<CharacterInfo> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/my_character`,
            method: 'get',
        })) as CharacterInfo
    }

    public createLobbyCombat = async (lobby_id: string, combatNickname: string, combatPreset: any) => {
        return await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/create_combat`,
            method: 'post',
            data: {
                lobby_id,
                combatNickname,
                combatPreset,
            },
        })
    }

    public getMyLobbies = async (): Promise<
        Array<{
            name: string
            isGm: boolean
            _id: string
        }>
    > => {
        return await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/user/joined_lobbies`,
            method: 'get',
        }).then((data) => data.joinedLobbies)
    }
}

export default new APIService()
