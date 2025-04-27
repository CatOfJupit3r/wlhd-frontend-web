import { FC } from 'react';

import { iUseDescriptionWithMemories, useDescriptionWithMemories } from '@hooks/UseDescriptionWithMemories';

interface iDescriptionWithMemories extends iUseDescriptionWithMemories {
    className?: string;
}

const DescriptionWithMemories: FC<iDescriptionWithMemories> = ({ className, description, memory: memories }) => {
    const { formated } = useDescriptionWithMemories({ description, memory: memories });

    return <p className={className}>{formated}</p>;
};

export default DescriptionWithMemories;
