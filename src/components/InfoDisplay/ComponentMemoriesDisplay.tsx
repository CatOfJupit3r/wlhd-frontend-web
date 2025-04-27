import { capitalize } from 'lodash';
import React, { FC, HTMLAttributes, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { GameComponentMemory, PossibleMemory } from '@models/GameModels';
import { memoryValueToTranslation } from '@utils/game-display-tools';

const ComponentMemory: React.FC<
    {
        memoryKey: string;
        memory: PossibleMemory;
    } & HTMLAttributes<HTMLLIElement>
> = ({ memoryKey, memory, ...props }) => {
    const { t } = useTranslation();
    const { display_name, internal } = memory;
    const [key, args] = useMemo(() => memoryValueToTranslation(memory, memoryKey), [memory, memoryKey]);

    return (
        <li className={'flex flex-row gap-1'} {...props}>
            <p>{capitalize(t(display_name))}</p> : <p className={internal ? 'text-gray-400' : ''}>{t(key, args)}</p>
        </li>
    );
};

const ComponentMemories: FC<{ memories: GameComponentMemory | null }> = ({ memories }) => {
    if (!memories || Object.keys(memories).length === 0) {
        return null;
    }
    return (
        <div id={'method-variables'} className={'mt-2 flex flex-col items-center gap-1 px-8 text-base'}>
            <ul>
                {Object.entries(memories)
                    .filter(([_, memory]) => !memory.internal)
                    .map(([key, memory], index) => {
                        return <ComponentMemory key={index} memory={memory} memoryKey={key} />;
                    })}
            </ul>
        </div>
    );
};

export default ComponentMemories;
