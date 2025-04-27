import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTags } from 'react-icons/fa';

import { Badge, BadgeVariants } from '@components/ui/badge';
import { GameTags } from '@models/CombatEditorModels';
import { PrefixCollection } from '@utils/game-display-tools';

interface iTag {
    tag: string;
    children?: ReactNode;
    badgeVariant?: BadgeVariants;
    className?: string;
}

export const IndividualTagDisplay: FC<iTag> = ({ tag, children, badgeVariant, className }) => {
    const { t } = useTranslation();
    return (
        <Badge variant={badgeVariant ?? 'outline'} className={className}>
            <p>{t(PrefixCollection.tags(tag))}</p>
            {children}
        </Badge>
    );
};

const TagsDisplay: FC<{ tags: GameTags }> = ({ tags }) => {
    if (!tags || tags.length === 0) {
        return null;
    }
    return (
        <div className={'flex w-full flex-row flex-wrap gap-1 text-sm'}>
            <FaTags className={'text-2xl'} />
            {tags.map((tag, index) => {
                return <IndividualTagDisplay key={index} tag={tag} badgeVariant={'secondary'} />;
            })}
        </div>
    );
};

export default TagsDisplay;
