import { CSSProperties, FC } from 'react';

import { Separator } from '@components/ui/separator';
import { cn } from '@utils';

import { RoundHeader } from './round-header';
import TurnOrderEditor from './turn-order-editor';

const RoundInfoEditor: FC<{ className?: string; style?: CSSProperties }> = ({ className, style }) => {
    return (
        <div className={cn('flex h-20 flex-row gap-4', className)} style={style}>
            <RoundHeader />
            <Separator orientation={'vertical'} className={'w-1 rounded-xl'} />
            <TurnOrderEditor />
        </div>
    );
};

export default RoundInfoEditor;
