import { iCharacterActions as ActionInputInterface } from '@type-defs/game-types';
import { atom } from 'jotai';

export const actionsAtom = atom<null | ActionInputInterface>(null);
export const isYourTurnAtom = atom<boolean>(false);
