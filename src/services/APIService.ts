import axios, { AxiosError } from 'axios'

import { ShortLobbyInformation, UserInformation } from '@models/APIData'
import { EntityInfoFull, ItemInfo, SpellInfo, StatusEffectInfo, WeaponInfo } from '@models/Battlefield'
import { LobbyInfo } from '@models/Redux'
import { TranslationJSON } from '@models/Translation'
import { REACT_APP_BACKEND_URL } from 'config'
import AuthManager from '@services/AuthManager'
import EventEmitter from 'events'

const errors = {
    TOKEN_EXPIRED: 'Your session expired. Please login again',
}

const isServerUnavailableError = (error: unknown) => {
    return error instanceof AxiosError && error.code === 'ERR_NETWORK'
}

class APIService {
    private backendRefusedConnection: boolean | null = null
    private emitter = new EventEmitter()
    private healthCheckNeeded = true
    private healthCheckInterval: NodeJS.Timeout | null = null
    private healthCheckIntervalTime = 1000 * 60 * 5 // 5 minutes

    eventTypes = {
        BACKEND_STATUS_CHANGED: 'BACKEND_STATUS_CHANGED',
    }

    public constructor() {
        this.addHealthCheckInterval()
    }

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
            } else if (isServerUnavailableError(error)) {
                this.handleBackendRefusedConnection()
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
        let response
        try {
            response = await axios.post(this.endpoints.LOGIN, { handle, password })
        } catch (error) {
            if (isServerUnavailableError(error)) {
                this.handleBackendRefusedConnection()
            }
            throw error
        }
        const { accessToken, refreshToken } = response.data
        AuthManager.login({ accessToken, refreshToken })
    }

    public createAccount = async (handle: string, password: string) => {
        try {
            await axios.post(this.endpoints.REGISTER, { handle, password })
        } catch (error) {
            if (isServerUnavailableError(error)) {
                this.handleBackendRefusedConnection()
            }
            throw error
        }
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

    public getLoadedWeapons = async (
        dlc: string
    ): Promise<{
        weapons: { [descriptor: string]: WeaponInfo }
    }> => {
        if (!dlc) {
            return {
                weapons: {},
            }
        }
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/game/weapons?dlc=${dlc}`,
            method: 'get',
        })) as {
            weapons: {
                [descriptor: string]: WeaponInfo
            }
        }
    }

    public getLoadedItems = async (
        dlc: string
    ): Promise<{
        items: {
            [descriptor: string]: ItemInfo
        }
    }> => {
        if (!dlc) {
            return {
                items: {},
            }
        }
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/game/items?dlc=${dlc}`,
            method: 'get',
        })) as {
            items: {
                [descriptor: string]: ItemInfo
            }
        }
    }

    public getLoadedSpells = async (
        dlc: string
    ): Promise<{
        spells: {
            [descriptor: string]: SpellInfo
        }
    }> => {
        if (!dlc) {
            return {
                spells: {},
            }
        }
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/game/spells?dlc=${dlc}`,
            method: 'get',
        })) as {
            spells: {
                [descriptor: string]: SpellInfo
            }
        }
    }

    public getLoadedStatusEffects = async (
        dlc: string
    ): Promise<{
        status_effects: {
            [descriptor: string]: StatusEffectInfo
        }
    }> => {
        if (!dlc) {
            return {
                status_effects: {},
            }
        }
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/game/status_effects?dlc=${dlc}`,
            method: 'get',
        })) as {
            status_effects: {
                [descriptor: string]: StatusEffectInfo
            }
        }
    }

    public getLoadedCharacters = async (
        dlc: string
    ): Promise<{
        characters: {
            [descriptor: string]: EntityInfoFull
        }
    }> => {
        if (!dlc) {
            return {
                characters: {},
            }
        }
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/game/characters?dlc=${dlc}`,
            method: 'get',
        })) as {
            characters: {
                [descriptor: string]: EntityInfoFull
            }
        }
    }

    public getCharacterInfo = async (lobby_id: string, descriptor: string): Promise<EntityInfoFull> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}/character/${descriptor}/`,
            method: 'get',
        })) as EntityInfoFull
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
        })) as UserInformation
    }

    public getShortLobbyInfo = async (lobby_id: string): Promise<ShortLobbyInformation> => {
        return (await this.fetch({
            url: `${REACT_APP_BACKEND_URL}/lobby/${lobby_id}?short=true`,
            method: 'get',
        })) as ShortLobbyInformation
    }

    private handleBackendRefusedConnection = () => {
        this.backendRefusedConnection = true
        this.emitter.emit(this.eventTypes.BACKEND_STATUS_CHANGED, this.backendRefusedConnection)
        this.addHealthCheckInterval()
    }

    public isBackendUnavailable = (): boolean | null => {
        if (this.backendRefusedConnection === null) {
            return null
        } else {
            return this.backendRefusedConnection
        }
    }

    public onBackendStatusChange = (callback: (status: boolean) => void) => {
        this.emitter.on(this.eventTypes.BACKEND_STATUS_CHANGED, callback)
        return () => {
            this.emitter.off(this.eventTypes.BACKEND_STATUS_CHANGED, callback)
        }
    }

    private healthCheck = async () => {
        console.log("Checking backend's health")
        if (!this.healthCheckNeeded) {
            this.removeHealthCheckInterval()
        }
        try {
            await axios.get(`${REACT_APP_BACKEND_URL}/health/`)
        } catch (error) {
            if (isServerUnavailableError(error)) {
                this.backendRefusedConnection = true
                this.emitter.emit(this.eventTypes.BACKEND_STATUS_CHANGED, this.backendRefusedConnection)
                return
            }
        }
        this.backendRefusedConnection = false
        this.removeHealthCheckInterval()
        this.emitter.emit(this.eventTypes.BACKEND_STATUS_CHANGED, this.backendRefusedConnection)
    }

    private removeHealthCheckInterval = () => {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval)
        }
    }

    private addHealthCheckInterval = () => {
        if (this.backendRefusedConnection === null) {
            this.healthCheck().then()
        } else {
            if (this.healthCheckInterval) {
                clearInterval(this.healthCheckInterval)
            }
            this.healthCheckInterval = setInterval(() => {
                this.healthCheck().then()
            }, this.healthCheckIntervalTime)
        }
    }
}

export default new APIService()
