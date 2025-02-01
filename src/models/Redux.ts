import {
    Battlefield,
    CharacterInfoFull,
    GameHandshake,
    GameStateContainer,
    iCharacterActions as ActionInputInterface,
    iGameLobbyState,
    IndividualTurnOrder,
} from './GameModels';

export interface CosmeticsState {
    pageTitle: string;
}

export interface iCombatInfo {
    nickname: string;
    isActive: boolean;
    roundCount: number;
    activePlayers: Array<{
        handle: string;
        nickname: string;
    }>;
    _id: string;
}

export interface iLobbyPlayerInfo {
    handle: string;
    nickname: string;
    userId: string;
    characters: Array<[string, string]>;
}

export interface iWaitingApprovalPlayer {
    handle: string;
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

export interface GameScreenState {
    battlefield: Battlefield;
    actions: null | ActionInputInterface;
    round: {
        current: GameHandshake['roundCount'];
        order: IndividualTurnOrder;
    };
    messages: GameStateContainer;
    gameFlow: {
        type: 'pending' | 'active' | 'ended' | 'aborted';
        details: string;
    };
    gameLobbyState: iGameLobbyState;
    controlledCharacters: Array<CharacterInfoFull> | null;
    yourTurn: boolean;
    actionTimestamp: number | null;
}
