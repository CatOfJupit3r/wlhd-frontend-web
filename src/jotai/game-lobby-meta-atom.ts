import { iGameLobbyState } from '@type-defs/GameModels';
import { iGameFlowState } from '@type-defs/api-data';
import { atom } from 'jotai';

export const gameFlowAtom = atom<iGameFlowState>({
    type: 'pending',
    details: '',
});
export const lobbyStateAtom = atom<iGameLobbyState>({
    players: [],
});
