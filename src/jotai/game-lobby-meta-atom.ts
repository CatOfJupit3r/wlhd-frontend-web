import { atom } from 'jotai';

import { iGameLobbyState } from '@models/GameModels';
import { iGameFlowState } from '@models/Redux';

export const gameFlowAtom = atom<iGameFlowState>({
    type: 'pending',
    details: '',
});
export const lobbyStateAtom = atom<iGameLobbyState>({
    players: [],
});
