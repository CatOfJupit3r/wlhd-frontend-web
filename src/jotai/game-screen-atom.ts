import { atom } from 'jotai';

import { CharacterInfoFull, GameHandshake, GameStateContainer, IndividualTurnOrder } from '@models/GameModels';

export const roundAtom = atom<GameHandshake['roundCount']>(0);
export const characterOrderAtom = atom<IndividualTurnOrder>([]);
export const gameMessagesAtom = atom<GameStateContainer>([]);
export const controlledCharactersAtom = atom<Array<CharacterInfoFull>>([]);
export const selectActiveCharacterAtom = atom((get) => {
    const order = get(characterOrderAtom);
    return order[0]; // the first character in the turn order is the active character. if none, then it's round end.
});
