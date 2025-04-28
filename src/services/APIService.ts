import axios, { AxiosError } from 'axios';
import { VITE_BACKEND_URL, VITE_CDN_URL } from 'config';
import { Resource } from 'i18next';
import { merge } from 'lodash';

import {
    AreaEffectEditable,
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
    iMyCharacter,
    iUserExtraData,
    iUserPatchData,
    iUserStatistics,
    iWaitingApprovalPlayer,
    LimitedDLCData,
    ShortLobbyInformation,
} from '@models/api-data';
import APIHealth, { isServerUnavailableError } from '@services/APIHealth';
import AuthService from '@services/AuthService';

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
    USER_JOINED_LOBBIES: `${VITE_BACKEND_URL}/user/joined`,
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
    GAME_AREA_EFFECTS: (dlc: string) => `${VITE_BACKEND_URL}/game/${dlc}/area_effects`,
    GAME_AREA_EFFECT_INFO: (dlc: string, descriptor: string) =>
        `${VITE_BACKEND_URL}/game/${dlc}/area_effects/${descriptor}`,
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
    GET_USER_AVATAR: (userId: string) => `${VITE_BACKEND_URL}/user/${userId}/avatar`,

    APPROVE_LOBBY_PLAYER: (lobbyId: string, userId: string) =>
        `${VITE_BACKEND_URL}/lobbies/${lobbyId}/${userId}/approve`,
    REMOVE_LOBBY_PLAYER: (lobbyId: string, userId: string) => `${VITE_BACKEND_URL}/lobbies/${lobbyId}/${userId}`,
    DELETE_INVITE_CODE: (lobbyId: string, code: string) => `${VITE_BACKEND_URL}/lobbies/${lobbyId}/invites/${code}`,
    GET_INVITE_CODES: (lobbyId: string) => `${VITE_BACKEND_URL}/lobbies/${lobbyId}/invites`,
    CREATE_INVITE_CODE: (lobbyId: string) => `${VITE_BACKEND_URL}/lobbies/${lobbyId}/invites`,

    USER_STATISTICS: `${VITE_BACKEND_URL}/user/statistics?short=true`,
    USER_CHARACTERS: `${VITE_BACKEND_URL}/user/characters`,
    ADD_CREDENTIAL_AUTH: `${VITE_BACKEND_URL}/user/me/auth/add-credential-auth`,
    PATCH_USER_INFO: `${VITE_BACKEND_URL}/user/me`,
    USER_EXTRA_DATA: `${VITE_BACKEND_URL}/user/me/extra`,
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
        try {
            console.log('Fetching the API...', url);
            const result = await axios(url, {
                method,
                data,
                withCredentials: true,
            });
            console.log('Fetch succeeded', url);
            return result.data;
        } catch (error: unknown) {
            if (!(error instanceof AxiosError)) throw error;
            if (error.response && error.response.status === 401) {
                console.log('Received Unauthorized error from server');
                await AuthService.getInstance().signOut();
                throw new Error(errors.TOKEN_EXPIRED);
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

    public getTranslations = async (languages: Array<string>, dlcs: Array<string>) => {
        const result: Resource = {};
        for (const dlc of dlcs) {
            try {
                const translations = await this.fetch<Resource>({
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
            return await this.fetch<Resource>({
                url: ENDPOINTS.CUSTOM_LOBBY_TRANSLATIONS(lobby_id),
                method: 'get',
            });
        } catch (e) {
            console.log(e);
            return {} as Resource;
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

    public getUserAvatarEndpoint = (userId: string) => {
        return ENDPOINTS.GET_USER_AVATAR(userId);
    };

    public async approveLobbyPlayer(lobbyId: string, userId: string) {
        return this.fetch<{
            players: Array<iLobbyPlayerInfo>;
            waitingApproval: Array<iWaitingApprovalPlayer>;
            message: string;
        }>({
            url: ENDPOINTS.APPROVE_LOBBY_PLAYER(lobbyId, userId),
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

    public async removeLobbyMember(lobbyId: string, userId: string) {
        return this.fetch<{ players: Array<iLobbyPlayerInfo>; waitingApproval: Array<iWaitingApprovalPlayer> }>({
            url: ENDPOINTS.REMOVE_LOBBY_PLAYER(lobbyId, userId),
            method: 'delete',
        });
    }

    public async joinLobbyUsingInviteCode({ inviteCode }: { inviteCode: string }) {
        const { joined } = await this.fetch<{ joined: Array<ShortLobbyInformation> }>({
            url: ENDPOINTS.USE_INVITE_CODE,
            method: 'post',
            data: { inviteCode },
        });
        return joined;
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

    public getLoadedAreaEffects = async (dlc: string) => {
        if (!dlc) {
            return {};
        }
        const { areaEffects } = await this.fetch<{ areaEffects: LimitedDLCData }>({
            url: ENDPOINTS.GAME_AREA_EFFECTS(dlc),
            method: 'get',
        });
        return areaEffects;
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

    public getAreaEffectInformation = async (dlc: string, descriptor: string) => {
        const { areaEffect } = await this.fetch<{ areaEffect: AreaEffectEditable }>({
            url: ENDPOINTS.GAME_AREA_EFFECT_INFO(dlc, descriptor),
            method: 'get',
        });
        return areaEffect;
    };

    public getCharacterInformation = async (dlc: string, descriptor: string) => {
        const { character } = await this.fetch<{ character: CharacterDataEditable }>({
            url: ENDPOINTS.GAME_CHARACTER_INFO(dlc, descriptor),
            method: 'get',
        });
        return character;
    };

    public getJoinedLobbies = async () => {
        const { joined } = await this.fetch<{ joined: Array<ShortLobbyInformation> }>({
            url: ENDPOINTS.USER_JOINED_LOBBIES,
            method: 'get',
        });
        return joined;
    };

    public getMyStatistics = async () => {
        return await this.fetch<iUserStatistics>({
            url: ENDPOINTS.USER_STATISTICS,
            method: 'get',
        });
    };

    public getMyCharacters = async () => {
        const { characters } = await this.fetch<{
            characters: Array<iMyCharacter>;
        }>({
            url: ENDPOINTS.USER_CHARACTERS,
            method: 'get',
        });
        return characters;
    };

    public addCredentialAuth = async (data: { username: string; password: string }) => {
        return await this.fetch({
            url: ENDPOINTS.ADD_CREDENTIAL_AUTH,
            method: 'post',
            data,
        });
    };

    public patchUserData = async (data: Partial<iUserPatchData>) => {
        return await this.fetch<iUserPatchData>({
            url: ENDPOINTS.PATCH_USER_INFO,
            method: 'patch',
            data,
        });
    };

    public getMyExtraData = async () => {
        return await this.fetch<iUserExtraData>({
            url: ENDPOINTS.USER_EXTRA_DATA,
            method: 'get',
        });
    };
}

export default new APIService();
