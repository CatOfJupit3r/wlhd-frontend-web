import axios, { AxiosError } from 'axios';
import { merge } from 'lodash';

import { iUserAvatarProcessed, LimitedDLCData, ShortLobbyInformation, UserInformation } from '@models/APIData';
import {
    CharacterDataEditable,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@models/CombatEditorModels';
import { CharacterClassConversion, CreateCombatBody } from '@models/EditorConversion';
import {
    iCharacterInLobby,
    iInviteCode,
    iLobbyInformation,
    iLobbyPlayerInfo,
    iWaitingApprovalPlayer,
} from '@models/Redux';
import { TranslationJSON } from '@models/Translation';
import APIHealth, { isServerUnavailableError } from '@services/APIHealth';
import AuthManager from '@services/AuthManager';
import { VITE_BACKEND_URL, VITE_CDN_URL } from 'config';

const errors = {
    TOKEN_EXPIRED: 'Your session expired. Please login again',
};

const ENDPOINTS = {
    LOGIN: `${VITE_BACKEND_URL}/login`,
    LOGOUT: `${VITE_BACKEND_URL}/logout`,
    REGISTER: `${VITE_BACKEND_URL}/register`,
    REFRESH_TOKEN: `${VITE_BACKEND_URL}/token`,
    HEALTH_CHECK: `${VITE_BACKEND_URL}/health`,
    USER_INFO: `${VITE_BACKEND_URL}/user/profile`,
    USE_INVITE_CODE: `${VITE_BACKEND_URL}/user/join`,

    CUSTOM_LOBBY_TRANSLATIONS: (lobby_id: string) => `${VITE_BACKEND_URL}/lobbies/${lobby_id}/custom_translations`,
    LOBBY_INFO: (lobby_id: string) => `${VITE_BACKEND_URL}/lobbies/${lobby_id}`,
    LOBBY_PLAYERS: (lobby_id: string) => `${VITE_BACKEND_URL}/lobbies/${lobby_id}/players`,

    GAME_WEAPONS: (dlc: string) => `${VITE_BACKEND_URL}/game/${dlc}/weapons`,
    GAME_WEAPON_INFO: (dlc: string, descriptor: string) => `${VITE_BACKEND_URL}/game/${dlc}/weapons/${descriptor}`,
    GAME_ITEMS: (dlc: string) => `${VITE_BACKEND_URL}/game/${dlc}/items`,
    GAME_ITEM_INFO: (dlc: string, descriptor: string) => `${VITE_BACKEND_URL}/game/${dlc}/items/${descriptor}`,
    GAME_SPELLS: (dlc: string) => `${VITE_BACKEND_URL}/game/${dlc}/spells`,
    GAME_SPELL_INFO: (dlc: string, descriptor: string) => `${VITE_BACKEND_URL}/game/${dlc}/spells/${descriptor}`,
    GAME_STATUS_EFFECTS: (dlc: string) => `${VITE_BACKEND_URL}/game/${dlc}/status_effects`,
    GAME_STATUS_EFFECT_INFO: (dlc: string, descriptor: string) =>
        `${VITE_BACKEND_URL}/game/${dlc}/status_effects/${descriptor}`,
    GAME_CHARACTERS: (dlc: string) => `${VITE_BACKEND_URL}/game/${dlc}/characters`,
    GAME_CHARACTER_INFO: (dlc: string, descriptor: string) =>
        `${VITE_BACKEND_URL}/game/${dlc}/characters/${descriptor}`,

    LOBBY_CHARACTER_INFO: (lobby_id: string, descriptor: string) =>
        `${VITE_BACKEND_URL}/lobbies/${lobby_id}/characters/${descriptor}/`,
    CREATE_LOBBY_COMBAT: (lobby_id: string) => `${VITE_BACKEND_URL}/lobbies/${lobby_id}/combats`,
    SHORT_LOBBY_INFO: (lobby_id: string) => `${VITE_BACKEND_URL}/lobbies/${lobby_id}?short=true`,
    ASSIGN_PLAYER_TO_CHARACTER: (lobbyId: string, descriptor: string) =>
        `${VITE_BACKEND_URL}/lobbies/${lobbyId}/characters/${descriptor}/players`,
    REMOVE_PLAYER_FROM_CHARACTER: (lobbyId: string, descriptor: string) =>
        `${VITE_BACKEND_URL}/lobbies/${lobbyId}/characters/${descriptor}/players`,
    DELETE_CHARACTER: (lobbyId: string, descriptor: string) =>
        `${VITE_BACKEND_URL}/lobbies/${lobbyId}/characters/${descriptor}`,
    UPDATE_CHARACTER: (lobbyId: string, descriptor: string) =>
        `${VITE_BACKEND_URL}/lobbies/${lobbyId}/characters/${descriptor}`,
    CDN_GET_TRANSLATIONS: (languages: Array<string>, dlc: string) =>
        `${VITE_CDN_URL}/game/${dlc}/translations?languages=${languages.join(',')}`,
    GET_USER_AVATAR: (handle: string) => `${VITE_BACKEND_URL}/user/${handle}/avatar`,

    APPROVE_LOBBY_PLAYER: (lobbyId: string, handle: string) =>
        `${VITE_BACKEND_URL}/lobbies/${lobbyId}/${handle}/approve`,
    REMOVE_LOBBY_PLAYER: (lobbyId: string, handle: string) => `${VITE_BACKEND_URL}/lobbies/${lobbyId}/${handle}`,
    DELETE_INVITE_CODE: (lobbyId: string, code: string) => `${VITE_BACKEND_URL}/lobbies/${lobbyId}/invites/${code}`,
    GET_INVITE_CODES: (lobbyId: string) => `${VITE_BACKEND_URL}/lobbies/${lobbyId}/invites`,
    CREATE_INVITE_CODE: (lobbyId: string) => `${VITE_BACKEND_URL}/lobbies/${lobbyId}/invites`,
};

class APIService {
    private injectResponseMessageToError = (error: AxiosError) => {
        if (!error.response) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (error.response?.data as any).message;
        if (typeof message === 'string') error.message = message;
    };

    private fetch = async <T>({
        url,
        method,
        data,
        _retry,
    }: {
        url: string;
        method: 'get' | 'post' | 'put' | 'delete' | 'patch';
        data?: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [_: string]: any;
        };
        _retry?: boolean;
    }): Promise<T> => {
        console.log('Checking token expiration');
        if (AuthManager.isAccessTokenExpired()) {
            console.log('Token is expired');
            await this.tryRefreshingTokenOrLogoutAndThrow();
        }
        try {
            console.log('Fetching the API...', url);
            const result = await axios(url, {
                method,
                headers: {
                    ...(AuthManager.authHeader() || {}),
                },
                data,
            });
            console.log('Fetch succeeded', url);
            return result.data;
        } catch (error: unknown) {
            if (!(error instanceof AxiosError)) throw error;
            if (error.response && error.response.status === 401) {
                console.log('Received Unauthorized error from server');
                if (_retry) {
                    console.log('The request has already been retried, so we logout');
                    await this.logout();
                    throw new Error(errors.TOKEN_EXPIRED);
                } else {
                    console.log('Trying to refresh the access token');
                    await this.tryRefreshingTokenOrLogoutAndThrow();
                    console.log('Retrying original request with new access token', url);
                    const retryData = await this.fetch<T>({
                        url,
                        method,
                        data,
                        _retry: true,
                    });

                    console.log('Retry succeeded!', url);
                    return retryData;
                }
            } else if (isServerUnavailableError(error)) {
                APIHealth.handleBackendRefusedConnection();
                this.injectResponseMessageToError(error);
                throw error;
            } else {
                this.injectResponseMessageToError(error);
                throw error;
            }
        }
    };

    private tryRefreshingTokenOrLogoutAndThrow = async () => {
        try {
            console.log('Refreshing token');
            await this.refreshToken();
            console.log('Token successfully refreshed');
        } catch (error) {
            console.log('Error refreshing token', error);
            console.log('Logging out user.');
            // error refreshing token
            await this.logout();
            throw new Error(errors.TOKEN_EXPIRED);
        }
    };

    public refreshToken = async () => {
        const refreshToken = AuthManager.getRefreshToken();
        const {
            data: { accessToken },
        } = await axios({
            url: ENDPOINTS.REFRESH_TOKEN,
            method: 'post',
            data: { token: refreshToken },
        });
        AuthManager.setAccessToken(accessToken);
    };

    public logout = async () => {
        AuthManager.logout();
        const refreshToken = AuthManager.getRefreshToken();
        if (refreshToken) {
            return axios({
                url: ENDPOINTS.LOGOUT,
                method: 'post',
                data: { token: refreshToken },
            });
        }
        return null;
    };

    public login = async (handle: string, password: string) => {
        let response;
        try {
            response = await axios.post(ENDPOINTS.LOGIN, { handle, password });
        } catch (error) {
            if (isServerUnavailableError(error)) {
                APIHealth.handleBackendRefusedConnection();
            }
            throw error;
        }
        const { accessToken, refreshToken } = response.data;
        AuthManager.login({ accessToken, refreshToken });
    };

    public createAccount = async (handle: string, password: string) => {
        try {
            await axios.post(ENDPOINTS.REGISTER, { handle, password });
        } catch (error) {
            if (isServerUnavailableError(error)) {
                APIHealth.handleBackendRefusedConnection();
            }
            throw error;
        }
        await this.login(handle, password);
    };

    public getTranslations = async (languages: Array<string>, dlcs: Array<string>): Promise<TranslationJSON> => {
        const result = {};
        for (const dlc of dlcs) {
            try {
                const translations = await this.fetch({
                    url: ENDPOINTS.CDN_GET_TRANSLATIONS(
                        languages.map((lan) => lan.replace('-', '_')),
                        dlc,
                    ),
                    method: 'get',
                });
                merge(result, translations);
            } catch (e) {
                console.log(e);
            }
        }
        return result;
    };

    public getCustomLobbyTranslations = async (lobby_id: string) => {
        try {
            return await this.fetch<TranslationJSON>({
                url: ENDPOINTS.CUSTOM_LOBBY_TRANSLATIONS(lobby_id),
                method: 'get',
            });
        } catch (e) {
            console.log(e);
            return {} as TranslationJSON;
        }
    };

    public getLobbyInfo = async (lobby_id: string) => {
        return this.fetch<iLobbyInformation>({
            url: ENDPOINTS.LOBBY_INFO(lobby_id),
            method: 'get',
        });
    };

    public getCharacterInfo = async (lobby_id: string, descriptor: string) => {
        return this.fetch<CharacterDataEditable>({
            url: ENDPOINTS.LOBBY_CHARACTER_INFO(lobby_id, descriptor),
            method: 'get',
        });
    };

    public createLobbyCombat = async (
        lobby_id: string,
        nickname: CreateCombatBody['nickname'],
        preset: CreateCombatBody['preset'],
    ) => {
        return await this.fetch<{ combat_id: string }>({
            url: ENDPOINTS.CREATE_LOBBY_COMBAT(lobby_id),
            method: 'post',
            data: {
                nickname,
                preset,
            },
        });
    };

    public getUserInformation = async () => {
        return this.fetch<UserInformation>({
            url: ENDPOINTS.USER_INFO,
            method: 'get',
        });
    };

    public getShortLobbyInfo = async (lobby_id: string) => {
        return this.fetch<ShortLobbyInformation>({
            url: ENDPOINTS.SHORT_LOBBY_INFO(lobby_id),
            method: 'get',
        });
    };

    public assignPlayerToCharacter = async (lobbyId: string, descriptor: string, playerId: string) => {
        return await this.fetch<{
            players: Array<iLobbyPlayerInfo>;
            characters: Array<iCharacterInLobby>;
        }>({
            url: ENDPOINTS.ASSIGN_PLAYER_TO_CHARACTER(lobbyId, descriptor),
            method: 'patch',
            data: {
                player_id: playerId,
            },
        });
    };

    public removePlayerFromCharacter = async (lobbyId: string, descriptor: string, playerId: string) => {
        return await this.fetch<{
            players: Array<iLobbyPlayerInfo>;
            characters: Array<iCharacterInLobby>;
        }>({
            url: ENDPOINTS.REMOVE_PLAYER_FROM_CHARACTER(lobbyId, descriptor),
            method: 'delete',
            data: {
                player_id: playerId,
            },
        });
    };

    public deleteCharacter = async (lobbyId: string, descriptor: string) => {
        return this.fetch<{
            characters: Array<iCharacterInLobby>;
            players: Array<iLobbyPlayerInfo>;
        }>({
            url: ENDPOINTS.DELETE_CHARACTER(lobbyId, descriptor),
            method: 'delete',
        });
    };

    public updateCharacter = async (lobbyId: string, descriptor: string, data: CharacterClassConversion) => {
        return this.fetch({
            url: ENDPOINTS.UPDATE_CHARACTER(lobbyId, descriptor),
            method: 'put',
            data,
        });
    };

    public getUserAvatar = async (handle: string) => {
        const res = (await this.fetch({
            url: ENDPOINTS.GET_USER_AVATAR(handle),
            method: 'get',
        })) as iUserAvatarProcessed | string | unknown;
        if (typeof res === 'string') return res;
        if (
            typeof res === 'object' &&
            res !== null &&
            'type' in res &&
            'content' in res &&
            typeof res.content === 'string'
        ) {
            if (res.type === 'static') return res.content;
            else if (res.type === 'generated') {
                return `data:image/png;base64,${res.content}`;
            }
        }
        return '';
    };

    public async approveLobbyPlayer(lobbyId: string, handle: string) {
        return this.fetch<{
            players: Array<iLobbyPlayerInfo>;
            waitingApproval: Array<iWaitingApprovalPlayer>;
            message: string;
        }>({
            url: ENDPOINTS.APPROVE_LOBBY_PLAYER(lobbyId, handle),
            method: 'patch',
        });
    }

    public async getInviteCodes({ lobbyId }: { lobbyId: string }) {
        const { codes } = await this.fetch<{ codes: Array<iInviteCode> }>({
            url: ENDPOINTS.GET_INVITE_CODES(lobbyId),
            method: 'get',
        });
        return (codes ?? []).map((code) => ({
            ...code,
            createdAt: new Date(code.createdAt),
            validUntil: new Date(code.validUntil),
        }));
    }

    public async createInviteCode({
        lobbyId,
        data,
    }: {
        lobbyId: string;
        data: { max_uses: number; valid_for: string };
    }) {
        const { codes } = await this.fetch<{ codes: Array<iInviteCode> }>({
            url: ENDPOINTS.CREATE_INVITE_CODE(lobbyId),
            method: 'post',
            data,
        });
        return (codes ?? []).map((code) => ({
            ...code,
            createdAt: new Date(code.createdAt),
            validUntil: new Date(code.validUntil),
        }));
    }

    public async deleteInviteCode({ lobbyId, code }: { lobbyId: string; code: string }) {
        const { codes } = await this.fetch<{ codes: Array<iInviteCode> }>({
            url: ENDPOINTS.DELETE_INVITE_CODE(lobbyId, code),
            method: 'delete',
        });
        return (codes ?? []).map((code) => ({
            ...code,
            createdAt: new Date(code.createdAt),
            validUntil: new Date(code.validUntil),
        }));
    }

    public async removeLobbyMember(lobbyId: string, handle: string) {
        return this.fetch<{ players: Array<iLobbyPlayerInfo>; waitingApproval: Array<iWaitingApprovalPlayer> }>({
            url: ENDPOINTS.REMOVE_LOBBY_PLAYER(lobbyId, handle),
            method: 'delete',
        });
    }

    public async joinLobbyUsingInviteCode({ inviteCode }: { inviteCode: string }) {
        const { profile } = await this.fetch<{ profile: UserInformation }>({
            url: ENDPOINTS.USE_INVITE_CODE,
            method: 'post',
            data: { inviteCode },
        });
        return profile;
    }

    public async getLobbyPlayers(lobbyId: string) {
        return this.fetch<{ players: Array<iLobbyPlayerInfo>; waitingApproval: Array<iWaitingApprovalPlayer> }>({
            url: ENDPOINTS.LOBBY_PLAYERS(lobbyId),
            method: 'get',
        });
    }

    public getLoadedWeapons = async (dlc: string) => {
        if (!dlc) {
            return {};
        }
        const { weapons } = await this.fetch<{ weapons: LimitedDLCData }>({
            url: ENDPOINTS.GAME_WEAPONS(dlc),
            method: 'get',
        });
        return weapons;
    };

    public getLoadedItems = async (dlc: string) => {
        if (!dlc) {
            return {};
        }
        const { items } = await this.fetch<{ items: LimitedDLCData }>({
            url: ENDPOINTS.GAME_ITEMS(dlc),
            method: 'get',
        });
        return items;
    };

    public getLoadedSpells = async (dlc: string) => {
        if (!dlc) {
            return {};
        }
        const { spells } = await this.fetch<{ spells: LimitedDLCData }>({
            url: ENDPOINTS.GAME_SPELLS(dlc),
            method: 'get',
        });
        return spells;
    };

    public getLoadedStatusEffects = async (dlc: string) => {
        if (!dlc) {
            return {};
        }
        const { statusEffects } = await this.fetch<{ statusEffects: LimitedDLCData }>({
            url: ENDPOINTS.GAME_STATUS_EFFECTS(dlc),
            method: 'get',
        });
        return statusEffects;
    };

    public getLoadedCharacters = async (dlc: string) => {
        if (!dlc) {
            return {};
        }
        const { characters } = await this.fetch<{ characters: LimitedDLCData }>({
            url: ENDPOINTS.GAME_CHARACTERS(dlc),
            method: 'get',
        });
        return characters;
    };

    public getWeaponInformation = async (dlc: string, descriptor: string) => {
        const { weapon } = await this.fetch<{ weapon: WeaponEditable }>({
            url: ENDPOINTS.GAME_WEAPON_INFO(dlc, descriptor),
            method: 'get',
        });
        return weapon;
    };

    public getItemInformation = async (dlc: string, descriptor: string) => {
        const { item } = await this.fetch<{ item: ItemEditable }>({
            url: ENDPOINTS.GAME_ITEM_INFO(dlc, descriptor),
            method: 'get',
        });
        return item;
    };

    public getSpellInformation = async (dlc: string, descriptor: string) => {
        const { spell } = await this.fetch<{ spell: SpellEditable }>({
            url: ENDPOINTS.GAME_SPELL_INFO(dlc, descriptor),
            method: 'get',
        });
        return spell;
    };

    public getStatusEffectInformation = async (dlc: string, descriptor: string) => {
        const { statusEffect } = await this.fetch<{ statusEffect: StatusEffectEditable }>({
            url: ENDPOINTS.GAME_STATUS_EFFECT_INFO(dlc, descriptor),
            method: 'get',
        });
        return statusEffect;
    };

    public getCharacterInformation = async (dlc: string, descriptor: string) => {
        const { character } = await this.fetch<{ character: CharacterDataEditable }>({
            url: ENDPOINTS.GAME_CHARACTER_INFO(dlc, descriptor),
            method: 'get',
        });
        return character;
    };
}

export default new APIService();
