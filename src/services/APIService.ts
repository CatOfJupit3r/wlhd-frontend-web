import axios, { AxiosError } from 'axios'

import { REACT_APP_BACKEND_URL } from '../config'
import { ShortLobbyInformation, UserInformation } from '../models/APIData'
import { AttributeInfo, ItemInfo, SpellInfo, StatusEffectInfo, WeaponInfo } from '../models/Battlefield'
import { CharacterInfo } from '../models/CharacterInfo'
import { LobbyInfo } from '../models/Redux'
import { TranslationJSON } from '../models/Translation'
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
            [_: string]: any
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
                    ...(AuthManager.authHeader() || {}),
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

    public getCustomLobbyTranslations = async (lobby_id: string): Promise<TranslationJSON> => {
        try {
            return await this.fetch({
                url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/custom_translations`,
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

    public getBasicCharacterInfo = async (lobby_id: string, descriptor: string): Promise<CharacterInfo> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/character/${descriptor}`,
            method: 'get',
        })) as CharacterInfo
    }

    public getCharacterWeaponry = async (
        lobby_id: string,
        descriptor: string
    ): Promise<{
        weaponry: Array<WeaponInfo>
    }> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/character/${descriptor}/weaponry`,
            method: 'get',
        })) as { weaponry: Array<WeaponInfo> }
    }

    public getCharacterSpellbook = async (
        lobby_id: string,
        descriptor: string
    ): Promise<{
        spells: {
            spellBook: Array<SpellInfo>
            spellLayout: { layout: Array<string>; conflicts: unknown }
        }
    }> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/character/${descriptor}/spellbook`,
            method: 'get',
        })) as { spells: { spellBook: Array<WeaponInfo>; spellLayout: { layout: Array<string>; conflicts: unknown } } }
    }

    public getCharacterStatusEffects = async (
        lobby_id: string,
        descriptor: string
    ): Promise<{
        statusEffects: Array<StatusEffectInfo>
    }> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/character/${descriptor}/status_effects`,
            method: 'get',
        })) as { statusEffects: Array<StatusEffectInfo> }
    }

    public getCharacterInventory = async (
        lobby_id: string,
        descriptor: string
    ): Promise<{
        inventory: Array<ItemInfo>
    }> => {
        console.log("Fetching character's inventory", lobby_id, descriptor)
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/character/${descriptor}/inventory/`,
            method: 'get',
        })) as { inventory: Array<WeaponInfo> }
    }

    public getCharacterAttributes = async (
        lobby_id: string,
        descriptor: string
    ): Promise<{
        attributes: AttributeInfo
    }> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/character/${descriptor}/attributes/`,
            method: 'get',
        })) as { attributes: { [attribute: string]: string } }
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

    public getUserInformation = async (): Promise<UserInformation> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/user/profile`,
            method: 'get',
        })) as {
            handle: string
            createdAt: string
            joined: Array<string>
        }
    }

    public getShortLobbyInfo = async (lobby_id: string): Promise<ShortLobbyInformation> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}?short=true`,
            method: 'get',
        })) as ShortLobbyInformation
    }
}

export default new APIService()
