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
