import {
    ActionPointsIcon,
    ActivenessIcon,
    AOEIcon,
    CooldownIcon,
    DurationIcon,
    LocationIcon,
    QuantityIcon,
    UsesIcon,
} from '@components/icons';
import ComponentMemories from '@components/InfoDisplay/ComponentMemoriesDisplay';
import DescriptionWithMemories from '@components/InfoDisplay/DescriptionWithMemories';
import TagsDisplay from '@components/InfoDisplay/TagsDisplay';
import SeparatedDiv from '@components/ui/separated-div';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import { AreaEffectInfo, ItemInfo, SpellInfo, StatusEffectInfo, WeaponInfo } from '@models/GameModels';
import { HTMLAttributes, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BiInfinite } from 'react-icons/bi';

interface WeaponSegment {
    type: 'weapon';
    info: WeaponInfo;
}

interface ItemSegment {
    type: 'item';
    info: ItemInfo;
}

interface SpellSegment {
    type: 'spell';
    info: SpellInfo;
}

interface StatusEffectSegment {
    type: 'status_effect';
    info: StatusEffectInfo;
}

interface AreaEffectSegment {
    type: 'area_effect';
    info: AreaEffectInfo;
}

export type InfoSegmentProps = WeaponSegment | ItemSegment | SpellSegment | StatusEffectSegment | AreaEffectSegment;

const RADIUS_TO_COMMON_NAMES: { [key: string]: string } = {
    '3,4': 'any-melee',
    '2,5': 'any-ranged',
    '1,6': 'any-safe',
    '1,2,3': 'any-enemy',
    '4,5,6': 'any-ally',
    '1,2,3,4,5,6': 'any',
};

const InfoDisplay = ({ type, info }: InfoSegmentProps) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.info-display',
    });
    const { t: tNoPrefix } = useTranslation();
    const { decorations } = info;

    const QuantityInfo = useMemo(() => {
        if (type !== 'item' && type !== 'weapon') return null;

        const { quantity } = info as ItemSegment['info'] | WeaponSegment['info'];
        return (
            <div>
                <Tooltip>
                    <TooltipTrigger className={'cursor-default'}>
                        <div className={'flex flex-row items-center gap-1'}>
                            <QuantityIcon />
                            <p>{quantity ?? '-'}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('tooltips.quantity')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }, [type, info]);

    const IsActiveDetails = useMemo(() => {
        if (type !== 'weapon' && type !== 'spell') return null;

        const { isActive } = info as WeaponSegment['info'] | SpellSegment['info'];
        return isActive ? <ActivenessIcon className={'size-6'} /> : null;
    }, [type, info]);

    const UsageDetails = useMemo(() => {
        if (type === 'status_effect' || type === 'area_effect') return null;

        const { userNeedsRange, uses } = info;
        return (
            <>
                <div className={''}>
                    <Tooltip>
                        <TooltipTrigger className={'cursor-default'}>
                            <div className={'flex flex-row items-center gap-1'}>
                                <LocationIcon className={'size-4'} />
                                <p>
                                    {userNeedsRange.toString() in RADIUS_TO_COMMON_NAMES
                                        ? t(`radius-alias.${RADIUS_TO_COMMON_NAMES[userNeedsRange.toString()]}`)
                                        : userNeedsRange.toString()}
                                </p>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>{t('tooltips.user-range')}</TooltipContent>
                    </Tooltip>
                </div>
                <div>
                    <Tooltip>
                        <TooltipTrigger className={'cursor-default'}>
                            <div className={'flex flex-row items-center gap-1'}>
                                <UsesIcon />
                                {`${uses.current ?? '-'}/${uses.max ?? '-'}`}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('tooltips.uses')}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </>
        );
    }, [type, info]);

    const CostDetails = useMemo(() => {
        if (type === 'status_effect' || type === 'area_effect') return null;

        const { cost } = info;
        return (
            <div>
                <Tooltip>
                    <TooltipTrigger className={'cursor-default'}>
                        <div className={'flex flex-row items-center gap-1 text-base'}>
                            <ActionPointsIcon />
                            <p>{cost ?? '-'}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>{t('tooltips.cost')}</TooltipContent>
                </Tooltip>
            </div>
        );
    }, [type, info]);

    const CooldownDetails = useMemo(() => {
        if (type === 'status_effect' || type === 'area_effect') return null;

        const { cooldown } = info;
        return (
            <div>
                <Tooltip>
                    <TooltipTrigger className={'cursor-default'}>
                        <div className={'flex flex-row items-center gap-1'}>
                            <CooldownIcon className={'size-5'} />
                            <p
                                style={{
                                    margin: '0',
                                    fontSize: '1rem',
                                    color: 'black',
                                }}
                            >
                                {cooldown ? `${cooldown.current ?? '-'}/${cooldown.max ?? '-'}` : '-'}
                            </p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('tooltips.cooldown')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }, [type, info]);

    const EffectDurationDetails = useMemo(() => {
        if (type !== 'status_effect' && type !== 'area_effect') return null;

        const { duration } = info;
        return (
            <div>
                <Tooltip>
                    <TooltipTrigger className={'cursor-default'}>
                        <div className={'flex items-center gap-1'}>
                            <DurationIcon className={'size-5'} />
                            {duration === null ? <BiInfinite className={'size-5'} /> : <p>{duration ?? '-'}</p>}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className={'text-base font-normal'}>
                        <p>{t('tooltips.duration')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }, [type, info]);

    const AreaAffectedDetails = useMemo(() => {
        if (type !== 'area_effect') return null;

        const { squares } = info;
        return (
            <div>
                <div className={'flex flex-row items-center gap-1'}>
                    <Tooltip>
                        <TooltipTrigger className={'cursor-default'}>
                            <AOEIcon className={'size-5'} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('tooltips.area-affected')}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger className={'cursor-default'}>
                            <p>{squares.length ?? '-'}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{squares.join(', ')}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        );
    }, [type, info]);

    return (
        <SeparatedDiv
            className={
                'border-container-medium relative flex w-full max-w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-3'
            }
        >
            <div id={'main-info'} className={'flex w-full flex-row justify-between overflow-hidden text-xl font-bold'}>
                <div className={'flex flex-row items-center gap-2'}>
                    {tNoPrefix(decorations?.name) ?? '???'}
                    {IsActiveDetails}
                </div>
            </div>
            <div id={'minor-info'} className={'relative flex flex-row justify-between text-base'}>
                <div>
                    {AreaAffectedDetails}
                    {QuantityInfo}
                    {UsageDetails}
                </div>
                <div id={'type-details'} className={'flex-col items-end gap-3'}>
                    {EffectDurationDetails}
                    {CooldownDetails}
                    {CostDetails}
                </div>
            </div>
            <DescriptionWithMemories
                description={decorations?.description}
                memory={info.memory}
                className={'break-words text-sm italic text-gray-400'}
            />
            {info.tags && info.tags.length > 0 ? (
                <>
                    <TagsDisplay tags={info.tags} />
                </>
            ) : null}
            {info.memory ? (
                <>
                    <ComponentMemories memories={info.memory} />
                </>
            ) : null}
        </SeparatedDiv>
    );
};

export const WeaponInfoDisplay = ({
    info,
    ...props
}: {
    info: WeaponSegment['info'];
} & HTMLAttributes<HTMLDivElement>) => <InfoDisplay type={'weapon'} info={info} {...props} />;
export const ItemInfoDisplay = ({ info, ...props }: { info: ItemSegment['info'] } & HTMLAttributes<HTMLDivElement>) => (
    <InfoDisplay type={'item'} info={info} {...props} />
);
export const SpellInfoDisplay = ({
    info,
    ...props
}: {
    info: SpellSegment['info'];
} & HTMLAttributes<HTMLDivElement>) => <InfoDisplay type={'spell'} info={info} {...props} />;
export const StatusEffectInfoDisplay = ({
    info,
    ...props
}: {
    info: StatusEffectSegment['info'];
} & HTMLAttributes<HTMLDivElement>) => <InfoDisplay type={'status_effect'} info={info} {...props} />;

export const AreaEffectInfoDisplay = ({
    info,
    ...props
}: {
    info: AreaEffectSegment['info'];
} & HTMLAttributes<HTMLDivElement>) => <InfoDisplay type={'area_effect'} info={info} {...props} />;
