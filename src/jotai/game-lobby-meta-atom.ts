import { iGameFlowState } from '@type-defs/api-data';
import { iGameLobbyState } from '@type-defs/game-types';
import { atom } from 'jotai';

export const gameFlowAtom = atom<iGameFlowState>({
    type: 'pending',
    details: '',
});
export const lobbyStateAtom = atom<iGameLobbyState>({
    players: [],
});
