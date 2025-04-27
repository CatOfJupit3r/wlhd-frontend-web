import { useBattlefieldContext } from '@context/BattlefieldContext';
import { selectAOEEffects } from '@redux/slices/gameScreenSlice';
import { AnimatePresence } from 'framer-motion';
import { FC, ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaInfoCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { AreaEffectInfoDisplay } from '@components/InfoDisplay/InfoDisplay';
import { AOEIcon, PlaceholderIcon } from '@components/icons';
import { ScrollArea, ScrollBar } from '@components/ui/scroll-area';
import { Separator } from '@components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import { AreaEffectInfo } from '@models/GameModels';
import { cn } from '@utils';

export const AOECard: FC<{ effect: AreaEffectInfo; bonusTooltip?: ReactNode; className?: string }> = ({
    effect,
    bonusTooltip,
    className,
}) => {
    const { addAOEHighlight } = useBattlefieldContext();

    const onHover = useCallback(() => {
        addAOEHighlight(effect.squares);
    }, [effect.squares, addAOEHighlight]);

    const onLeave = useCallback(() => {
        addAOEHighlight([]);
    }, [addAOEHighlight]);

    return (
        <div
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className={cn('mr-4 flex flex-row items-center justify-between', className)}
        >
            <PlaceholderIcon className={'w-full text-5xl'} />
            <div className={'flex h-full flex-col items-start justify-start gap-1 py-1'}>
                <Tooltip>
                    <TooltipTrigger className={'cursor-default'}>
                        <FaInfoCircle className={'w-full text-2xl'} />
                    </TooltipTrigger>
                    <TooltipContent className={'rounded-2xl border-none p-0'}>
                        <AreaEffectInfoDisplay info={effect} />
                        {bonusTooltip}
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};

const AOEEffectsDisplay = () => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.aoe-effects-display',
    });
    const effects = useSelector(selectAOEEffects);

    return (
        <div className={'flex h-full w-24 flex-col gap-2'}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={'flex flex-row items-center justify-between font-bold'}>
                        <AOEIcon className={'w-full text-4xl'} />
                        <p className={'w-full text-center text-2xl'}>{effects.length > 99 ? '99+' : effects.length}</p>
                    </div>
                </TooltipTrigger>
                <TooltipContent>{t('tooltip')}</TooltipContent>
            </Tooltip>
            <Separator orientation={'horizontal'} className={'h-[2px] rounded-xl'} />
            <ScrollArea className={cn('flex w-full flex-row gap-4')}>
                <AnimatePresence>
                    <div className={'flex flex-col gap-2'} style={{ maxHeight: 'calc(var(--tile-size) * 8)' }}>
                        {effects.map((effect, index) => (
                            <AOECard key={index} effect={effect} />
                        ))}
                    </div>
                </AnimatePresence>
                <ScrollBar orientation={'vertical'} />
            </ScrollArea>
        </div>
    );
};

export default AOEEffectsDisplay;
