import AreaEffectsEditor from '@components/CombatEditor/battlefield-section-editor/area-effects-editor';
import { BattlefieldRepresentation } from '@components/CombatEditor/battlefield-section-editor/battlefield-representation';
import { Separator } from '@components/ui/separator';
import { BattlefieldContextProvider } from '@context/BattlefieldContext';
import { FC } from 'react';

interface iBattlefieldEditor {
    setClickedSquare: (square: string | null) => void;
}

const BattlefieldSectionEditor: FC<iBattlefieldEditor> = ({ setClickedSquare }) => {
    return (
        <BattlefieldContextProvider>
            <div className={'flex w-full flex-row items-center justify-center gap-2'}>
                <AreaEffectsEditor />
                <Separator orientation={'vertical'} className={'w-1 rounded-lg'} />
                <BattlefieldRepresentation setClickedSquare={setClickedSquare} />
            </div>
        </BattlefieldContextProvider>
    );
};

export default BattlefieldSectionEditor;
