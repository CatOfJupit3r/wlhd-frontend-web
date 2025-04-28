import { FC } from 'react';

import { iUseDescriptionWithMemories, useDescriptionWithMemories } from '@hooks/use-description-with-memories';

interface iDescriptionWithMemories extends iUseDescriptionWithMemories {
    className?: string;
}

const DescriptionWithMemories: FC<iDescriptionWithMemories> = ({ className, description, memory: memories }) => {
    const { formated } = useDescriptionWithMemories({ description, memory: memories });

    return <p className={className}>{formated}</p>;
};

export default DescriptionWithMemories;
