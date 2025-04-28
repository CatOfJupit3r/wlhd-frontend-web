import { useActionContext } from '@context/ActionContext';
import { iAction, iActionDecoration } from '@type-defs/game-types';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsInfoCircle } from 'react-icons/bs';

import GameAsset from '@components/GameAsset';
import { StaticSkeleton } from '@components/ui/skeleton';
import { useDescriptionWithMemories } from '@hooks/UseDescriptionWithMemories';
import { cn } from '@utils';

export const OptionCardPlaceholder: FC = () => {
    return (
        <div className={'border-container-big unselectable mt-2 flex min-h-28 w-full min-w-full flex-col gap-2 p-3'}>
            <StaticSkeleton className="h-6 w-1/2" />
            <div className={'flex flex-row gap-2'}>
                <StaticSkeleton className="h-4 w-full max-w-36" />
                <StaticSkeleton className="h-4 w-full" />
            </div>
        </div>
    );
};

interface iOptionCard {
    decorations: iActionDecoration;
    disabled?: boolean;
    highlighted?: boolean;
    handleDoubleClick?: () => void;
}

const OptionCard: FC<iOptionCard> = ({ decorations, disabled, highlighted, handleDoubleClick }) => {
    const { t } = useTranslation();

    const { name, description, sprite, cost = '-', memories = {} } = decorations;
    const { formated: translatedText } = useDescriptionWithMemories({ description, memory: memories });

    const textNeedsTruncating = useMemo(() => translatedText.length > 250, [translatedText]);
    const displayedText = useMemo(
        () => (textNeedsTruncating ? translatedText.substring(0, 250) + '...' : translatedText),
        [translatedText, textNeedsTruncating],
    );

    return (
        <div
            className={cn(
                'mt-2 min-h-28 w-full min-w-full',
                'border-container-big flex flex-col gap-2 p-3',
                disabled
                    ? 'bg-gray-100 text-gray-400'
                    : 'hover:cursor-pointer hover:bg-blue-400 hover:text-white hover:transition-colors',
                'unselectable',
                highlighted && 'bg-blue-500 text-white',
            )}
            onDoubleClick={handleDoubleClick}
        >
            <div className={'flex flex-row items-center gap-2'}>
                {sprite ? <GameAsset src={sprite} className={'h-12 w-12 rounded-lg'} /> : null}
                <p className={'text-xl font-semibold'}>
                    {t(name)} {cost ? `(${cost})` : ''}
                </p>
            </div>
            <p className={''}>
                {displayedText} {textNeedsTruncating && <BsInfoCircle onClick={() => alert(t(description))} />}
            </p>
        </div>
    );
};

interface iOptionCardWithLogic {
    option: iAction;
    alias: string;
    highlighted?: boolean;
}

export const OptionCardWithLogic: FC<iOptionCardWithLogic> = ({ option, highlighted, alias }) => {
    const { setChoice } = useActionContext();

    const handleDoubleClick = useCallback(() => {
        if (!option.available) {
            return;
        }
        setChoice(alias, option.id);
    }, [option, setChoice]);

    return (
        <OptionCard
            decorations={option.decorations}
            disabled={!option.available}
            highlighted={highlighted}
            handleDoubleClick={handleDoubleClick}
        />
    );
};

export default OptionCard;
