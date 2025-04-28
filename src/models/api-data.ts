import { GameComponentDecoration } from '@models/GameModels';

export interface ShortLobbyInformation {
    name: string;
    isGm: boolean;
    _id: string;
    characters: Array<[string, string]>;
    needsApproval: boolean;
}

export interface UserInformation {
    createdAt: string;
}

export interface LimitedGameComponentData {
    descriptor: string;
    decorations: GameComponentDecoration;
}

export interface LimitedDLCData {
    [descriptor: string]: LimitedGameComponentData;
}

export interface iMyCharacter {
    _id: string;
    descriptor: string;
    lobbyId: string;
    decorations: GameComponentDecoration;
}

export interface iUserStatistics {
    characters: number;
    lobbies: number;
    gmLobbies: number;
}

export interface iUserExtraData {
    colors: {
        primary: string;
        secondary: string;
    };
}

export interface iUserPatchData {
    colors: {
        primary: string;
        secondary: string;
    };
    name: string;
}

export interface iCombatInfo {
    nickname: string;
    isActive: boolean;
    roundCount: number;
    activePlayers: Array<{
        userId: string;
        nickname: string;
    }>;
    _id: string;
}

export interface iLobbyPlayerInfo {
    nickname: string;
    userId: string;
    characters: Array<[string, string]>;
}

export interface iWaitingApprovalPlayer {
    name: string;
    userId: string;
}

export interface iInviteCode {
    code: string;
    createdAt: Date;
    validUntil: Date;
    uses: number;
    maxUses: number;
}

export interface iLobbyInformation {
    name: string;
    lobbyId: string;
    combats: Array<iCombatInfo>;
    players: Array<iLobbyPlayerInfo>;
    waitingApproval: Array<iWaitingApprovalPlayer>;
    characters: Array<iCharacterInLobby>;
    gm: string;
    layout: 'default' | 'gm';
}

export interface iCharacterInLobby {
    descriptor: string;
    decorations: {
        name: string;
        description: string;
        sprite: string;
    };
}

type GameFlowType = 'pending' | 'active' | 'ended' | 'aborted';

export interface iGameFlowState {
    type: GameFlowType;
    details: string;
}
