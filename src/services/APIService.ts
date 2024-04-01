/* eslint-disable no-console */

import axios, { AxiosError } from 'axios'
import { REACT_APP_BACKEND_URL } from '../config/configs'
import { ActionInput } from '../models/ActionInput'
import { Battlefield } from '../models/Battlefield'
import { default as AuthManager, default as authManager } from './AuthManager'

const errors = {
    TOKEN_EXPIRED: 'Your session expired. Please login again',
}

class APIService {
    private injectResponseMessageToError = (error: AxiosError) => {
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
            query: { [key: string]: any }
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
        } catch (error: any) {
            if (error.response.status === 401) {
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

    refreshToken = async () => {
        const refreshToken = AuthManager.getRefreshToken()
        const {
            data: { accessToken },
        } = await axios({
            url: '/api/auth/token',
            method: 'post',
            data: { token: refreshToken },
        })
        console.log('received new access token', accessToken)
        AuthManager.setAccessToken(accessToken)
    }

    logout = async () => {
        AuthManager.logout()
        const refreshToken = AuthManager.getRefreshToken()
        if (refreshToken) {
            return axios({
                url: '/api/auth/logout',
                method: 'post',
                data: { token: refreshToken },
            })
        }
        return null
    }

    login = async (handle: string, password: string) => {
        const response = await axios.post(`${REACT_APP_BACKEND_URL}/login`, { handle, password })
        const { accessToken, refreshToken } = response.data
        authManager.login({ accessToken, refreshToken })
    }

    createAccount = async (handle: string, password: string) => {
        await axios.post(`${REACT_APP_BACKEND_URL}/register`, { handle, password })
        await this.login(handle, password)
    }

    getTranslations = async (language: string, dlc: string): Promise<{ [key: string]: string }> => {
        try {
            const response = await this.fetch({
                url: `${REACT_APP_BACKEND_URL}/translation?dlc=${dlc}&language=${language}`,
                method: 'get',
            })
            return await response.json()
        } catch (e) {
            console.log(e)
            return {}
        }
    }

    getGameField = async (game_id: string): Promise<Battlefield> => {
        try {
            return (await this.fetch({
                url: `${REACT_APP_BACKEND_URL}/${game_id}/game_field`,
                method: 'get',
            })) as Battlefield
        } catch (e) {
            console.log(e)
            return {
                field: [],
                columns: [],
                lines: [],
                connectors: '',
                separators: '',
                field_pawns: {},
            }
        }
    }

    getGameState = async (game_id: string): Promise<{ [key: string]: string }> => {
        try {
            return await this.fetch({
                url: `${REACT_APP_BACKEND_URL}/${game_id}/game_state`,
                method: 'get',
            })
        } catch (e) {
            console.log(e)
            return {}
        }
    }

    getActions = async (game_id: string, entity_id: string): Promise<ActionInput> => {
        try {
            return (await this.fetch({
                url: `${REACT_APP_BACKEND_URL}/${game_id}/action_options/${entity_id}`,
                method: 'get',
            })) as ActionInput
        } catch (e) {
            console.log(e)
            return {
                action: [
                    {
                        id: 'builtins:skip',
                        translation_info: {
                            descriptor: 'builtins:skip',
                            co_descriptor: null,
                        },
                        available: true,
                        requires: null,
                    },
                ],
                aliases: {},
                alias_translations: {},
            }
        }
    }

    getMemoryCell = async (
        game_id: string,
        memory_cell: string
    ): Promise<{
        [key: string]: Array<[string, string[]]>
    }> => {
        try {
            return (await this.fetch({
                url: `${REACT_APP_BACKEND_URL}/${game_id}/memory_cell/${memory_cell}`,
                method: 'get',
            })) as { [key: string]: Array<[string, string[]]> }
        } catch (e) {
            console.log(e)
            return {}
        }
    }

    getAllMessages = async (game_id: string): Promise<{ [key: string]: Array<[string, string[]]> }> => {
        try {
            return await this.fetch({
                url: `${REACT_APP_BACKEND_URL}/${game_id}/all_messages`,
                method: 'get',
            })
        } catch (e) {
            console.log(e)
            return {}
        }
    }
}

export default new APIService()
