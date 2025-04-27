import { FC } from 'react';

import { SpellInfoDisplayPlaceholder } from '@components/InfoDisplay/InfoDisplayPlaceholder';

export const PseudoCategoryContent: FC = () => {
    return (
        <div>
            <div className={'grid grid-cols-2 gap-6 overflow-x-auto'}>
                <SpellInfoDisplayPlaceholder className={'flex flex-col gap-4 rounded border-2 p-4'} />
                <SpellInfoDisplayPlaceholder className={'flex flex-col gap-4 rounded border-2 p-4'} />
                <SpellInfoDisplayPlaceholder className={'flex flex-col gap-4 rounded border-2 p-4'} />
                <SpellInfoDisplayPlaceholder className={'flex flex-col gap-4 rounded border-2 p-4'} />
            </div>
        </div>
    );
};
