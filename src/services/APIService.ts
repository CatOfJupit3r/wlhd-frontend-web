import axios, { AxiosError } from 'axios'

import { ShortLobbyInformation, UserInformation } from '@models/APIData'
import {
    CharacterDataEditable,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@models/CombatEditorModels'
import { CharacterClassConversion, CreateCombatBody } from '@models/EditorConversion'
import { LobbyInfo } from '@models/Redux'
import { TranslationJSON } from '@models/Translation'
import APIHealth, { isServerUnavailableError } from '@services/APIHealth'
import AuthManager from '@services/AuthManager'
import { VITE_BACKEND_APP } from 'config'

const errors = {
    TOKEN_EXPIRED: 'Your session expired. Please login again',
}

const ENDPOINTS = {
    LOGIN: `${VITE_BACKEND_APP}/login`,
    LOGOUT: `${VITE_BACKEND_APP}/logout`,
    REGISTER: `${VITE_BACKEND_APP}/register`,
    REFRESH_TOKEN: `${VITE_BACKEND_APP}/token`,
    HEALTH_CHECK: `${VITE_BACKEND_APP}/health`,
    USER_INFO: `${VITE_BACKEND_APP}/user/profile`,

    CUSTOM_LOBBY_TRANSLATIONS: (lobby_id: string) => `${VITE_BACKEND_APP}/lobbies/${lobby_id}/custom_translations`,
    LOBBY_INFO: (lobby_id: string) => `${VITE_BACKEND_APP}/lobbies/${lobby_id}`,
    GAME_WEAPONS: (dlc: string) => `${VITE_BACKEND_APP}/game/weapons?dlc=${dlc}`,
    GAME_ITEMS: (dlc: string) => `${VITE_BACKEND_APP}/game/items?dlc=${dlc}`,
    GAME_SPELLS: (dlc: string) => `${VITE_BACKEND_APP}/game/spells?dlc=${dlc}`,
    GAME_STATUS_EFFECTS: (dlc: string) => `${VITE_BACKEND_APP}/game/status_effects?dlc=${dlc}`,
    GAME_CHARACTERS: (dlc: string) => `${VITE_BACKEND_APP}/game/characters?dlc=${dlc}`,
    LOBBY_CHARACTER_INFO: (lobby_id: string, descriptor: string) =>
        `${VITE_BACKEND_APP}/lobbies/${lobby_id}/characters/${descriptor}/`,
    CREATE_LOBBY_COMBAT: (lobby_id: string) => `${VITE_BACKEND_APP}/lobbies/${lobby_id}/combats`,
    SHORT_LOBBY_INFO: (lobby_id: string) => `${VITE_BACKEND_APP}/lobbies/${lobby_id}?short=true`,
    ASSIGN_PLAYER_TO_CHARACTER: (lobbyId: string, descriptor: string) =>
        `${VITE_BACKEND_APP}/lobbies/${lobbyId}/characters/${descriptor}/players`,
    REMOVE_PLAYER_FROM_CHARACTER: (lobbyId: string, descriptor: string) =>
        `${VITE_BACKEND_APP}/lobbies/${lobbyId}/characters/${descriptor}/players`,
    DELETE_CHARACTER: (lobbyId: string, descriptor: string) =>
        `${VITE_BACKEND_APP}/lobbies/${lobbyId}/characters/${descriptor}`,
    UPDATE_CHARACTER: (lobbyId: string, descriptor: string) =>
        `${VITE_BACKEND_APP}/lobbies/${lobbyId}/characters/${descriptor}`,
    GET_TRANSLATIONS: (languages: Array<string>, dlcs: Array<string>) =>
        `${VITE_BACKEND_APP}/translations?dlc=${dlcs.join(',')}&language=${languages.join(',')}`,
}

class APIService {
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
        method: 'get' | 'post' | 'put' | 'delete' | 'patch'
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
            } else if (isServerUnavailableError(error)) {
                APIHealth.handleBackendRefusedConnection()
                this.injectResponseMessageToError(error)
                throw error
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
            url: ENDPOINTS.REFRESH_TOKEN,
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
                url: ENDPOINTS.LOGOUT,
                method: 'post',
                data: { token: refreshToken },
            })
        }
        return null
    }

    public login = async (handle: string, password: string) => {
        let response
        try {
            response = await axios.post(ENDPOINTS.LOGIN, { handle, password })
        } catch (error) {
            if (isServerUnavailableError(error)) {
                APIHealth.handleBackendRefusedConnection()
            }
            throw error
        }
        const { accessToken, refreshToken } = response.data
        AuthManager.login({ accessToken, refreshToken })
    }

    public createAccount = async (handle: string, password: string) => {
        try {
            await axios.post(ENDPOINTS.REGISTER, { handle, password })
        } catch (error) {
            if (isServerUnavailableError(error)) {
                APIHealth.handleBackendRefusedConnection()
            }
            throw error
        }
        await this.login(handle, password)
    }

    public getTranslations = async (languages: Array<string>, dlcs: Array<string>): Promise<TranslationJSON> => {
        try {
            return await this.fetch({
                url: ENDPOINTS.GET_TRANSLATIONS(languages, dlcs),
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
                url: ENDPOINTS.CUSTOM_LOBBY_TRANSLATIONS(lobby_id),
                method: 'get',
            })
        } catch (e) {
            console.log(e)
            return {}
        }
    }

    public getLobbyInfo = async (lobby_id: string): Promise<LobbyInfo> => {
        return (await this.fetch({
            url: ENDPOINTS.LOBBY_INFO(lobby_id),
            method: 'get',
        })) as LobbyInfo
    }

    public getLoadedWeapons = async (
        dlc: string
    ): Promise<{
        weapons: { [descriptor: string]: WeaponEditable }
    }> => {
        if (!dlc) {
            return {
                weapons: {},
            }
        }
        return (await this.fetch({
            url: ENDPOINTS.GAME_WEAPONS(dlc),
            method: 'get',
        })) as {
            weapons: {
                [descriptor: string]: WeaponEditable
            }
        }
    }

    public getLoadedItems = async (
        dlc: string
    ): Promise<{
        items: {
            [descriptor: string]: ItemEditable
        }
    }> => {
        if (!dlc) {
            return {
                items: {},
            }
        }
        return (await this.fetch({
            url: ENDPOINTS.GAME_ITEMS(dlc),
            method: 'get',
        })) as {
            items: {
                [descriptor: string]: ItemEditable
            }
        }
    }

    public getLoadedSpells = async (
        dlc: string
    ): Promise<{
        spells: {
            [descriptor: string]: SpellEditable
        }
    }> => {
        if (!dlc) {
            return {
                spells: {},
            }
        }
        return (await this.fetch({
            url: ENDPOINTS.GAME_SPELLS(dlc),
            method: 'get',
        })) as {
            spells: {
                [descriptor: string]: SpellEditable
            }
        }
    }

    public getLoadedStatusEffects = async (
        dlc: string
    ): Promise<{
        status_effects: {
            [descriptor: string]: StatusEffectEditable
        }
    }> => {
        if (!dlc) {
            return {
                status_effects: {},
            }
        }
        return (await this.fetch({
            url: ENDPOINTS.GAME_STATUS_EFFECTS(dlc),
            method: 'get',
        })) as {
            status_effects: {
                [descriptor: string]: StatusEffectEditable
            }
        }
    }

    public getLoadedCharacters = async (
        dlc: string
    ): Promise<{
        characters: {
            [descriptor: string]: CharacterDataEditable
        }
    }> => {
        if (!dlc) {
            return {
                characters: {},
            }
        }
        return (await this.fetch({
            url: ENDPOINTS.GAME_CHARACTERS(dlc),
            method: 'get',
        })) as {
            characters: {
                [descriptor: string]: CharacterDataEditable
            }
        }
    }

    public getCharacterInfo = async (lobby_id: string, descriptor: string): Promise<CharacterDataEditable> => {
        return (await this.fetch({
            url: ENDPOINTS.LOBBY_CHARACTER_INFO(lobby_id, descriptor),
            method: 'get',
        })) as CharacterDataEditable
    }

    public createLobbyCombat = async (
        lobby_id: string,
        nickname: CreateCombatBody['nickname'],
        preset: CreateCombatBody['preset']
    ) => {
        return await this.fetch({
            url: ENDPOINTS.CREATE_LOBBY_COMBAT(lobby_id),
            method: 'post',
            data: {
                nickname,
                preset,
            },
        })
    }

    public getUserInformation = async (): Promise<UserInformation> => {
        return (await this.fetch({
            url: ENDPOINTS.USER_INFO,
            method: 'get',
        })) as UserInformation
    }

    public getShortLobbyInfo = async (lobby_id: string): Promise<ShortLobbyInformation> => {
        return (await this.fetch({
            url: ENDPOINTS.SHORT_LOBBY_INFO(lobby_id),
            method: 'get',
        })) as ShortLobbyInformation
    }

    public assignPlayerToCharacter = async (
        lobbyId: string,
        descriptor: string,
        playerId: string
    ): Promise<unknown> => {
        return await this.fetch({
            url: ENDPOINTS.ASSIGN_PLAYER_TO_CHARACTER(lobbyId, descriptor),
            method: 'patch',
            data: {
                player_id: playerId,
            },
        })
    }

    public removePlayerFromCharacter = async (
        lobbyId: string,
        descriptor: string,
        playerId: string
    ): Promise<unknown> => {
        return await this.fetch({
            url: ENDPOINTS.REMOVE_PLAYER_FROM_CHARACTER(lobbyId, descriptor),
            method: 'delete',
            data: {
                player_id: playerId,
            },
        })
    }

    public deleteCharacter = async (lobbyId: string, descriptor: string): Promise<unknown> => {
        return await this.fetch({
            url: ENDPOINTS.DELETE_CHARACTER(lobbyId, descriptor),
            method: 'delete',
        })
    }

    public updateCharacter = async (
        lobbyId: string,
        descriptor: string,
        data: CharacterClassConversion
    ): Promise<unknown> => {
        return await this.fetch({
            url: ENDPOINTS.UPDATE_CHARACTER(lobbyId, descriptor),
            method: 'put',
            data,
        })
    }
}

export default new APIService()
