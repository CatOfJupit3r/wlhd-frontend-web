import { iCharacterActions as ActionInputInterface } from '@type-defs/GameModels';
import { atom } from 'jotai';

export const actionsAtom = atom<null | ActionInputInterface>(null);
export const isYourTurnAtom = atom<boolean>(false);
