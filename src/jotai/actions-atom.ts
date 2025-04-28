import { atom } from 'jotai';

import { iCharacterActions as ActionInputInterface } from '@models/GameModels';

export const actionsAtom = atom<null | ActionInputInterface>(null);
export const isYourTurnAtom = atom<boolean>(false);
