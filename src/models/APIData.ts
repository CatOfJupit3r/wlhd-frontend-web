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
