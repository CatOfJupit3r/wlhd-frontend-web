import { AreaEffectInfo, Battlefield } from '@type-defs/GameModels';
import { atom } from 'jotai';

const generateDefaultBattlefield = (): Battlefield['pawns'] => {
    const pawns: Battlefield['pawns'] = {};
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            pawns[`${i + 1}/${j + 1}`] = {
                character: null,
            };
        }
    }
    return pawns;
};

export const battlefieldAtom = atom<Battlefield['pawns']>(generateDefaultBattlefield());
export const aoeAtom = atom<Array<AreaEffectInfo>>([]);
export const timestampAtom = atom<null | number>(null);
