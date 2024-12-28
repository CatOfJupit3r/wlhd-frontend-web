import { ActiveIcon, LocationIcon } from '@components/icons'
import ComponentMemories from '@components/InfoDisplay/ComponentMemoriesDisplay'
import DescriptionWithMemories from '@components/InfoDisplay/DescriptionWithMemories'
import TagsDisplay from '@components/InfoDisplay/TagsDisplay'
import SeparatedDiv from '@components/ui/separated-div'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { ItemInfo, SpellInfo, StatusEffectInfo, WeaponInfo } from '@models/GameModels'
import { HTMLAttributes, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { BiInfinite } from 'react-icons/bi'
import { FaBoxes, FaHourglassHalf } from 'react-icons/fa'
import { LuTally5 } from 'react-icons/lu'
import { PiClockCountdownBold, PiSneakerMoveFill } from 'react-icons/pi'

interface WeaponSegment {
    type: 'weapon'
    info: WeaponInfo
}

interface ItemSegment {
    type: 'item'
    info: ItemInfo
}

interface SpellSegment {
    type: 'spell'
    info: SpellInfo
}

interface StatusEffectSegment {
    type: 'status_effect'
    info: StatusEffectInfo
}

export type InfoSegmentProps = WeaponSegment | ItemSegment | SpellSegment | StatusEffectSegment

const RADIUS_TO_COMMON_NAMES: { [key: string]: string } = {
    '3,4': 'any-melee',
    '2,5': 'any-ranged',
    '1,6': 'any-safe',
    '1,2,3': 'any-enemy',
    '4,5,6': 'any-ally',
    '1,2,3,4,5,6': 'any',
}

const InfoDisplay = ({ type, info }: InfoSegmentProps) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.info-display',
    })
    const { t: tNoPrefix } = useTranslation()
    const { decorations } = info

    const QuantityInfo = useCallback(({ info }: ItemSegment | WeaponSegment) => {
        return (
            <div>
                <Tooltip>
                    <TooltipTrigger className={'cursor-default'}>
                        <div className={'flex flex-row items-center gap-1'}>
                            <FaBoxes />
                            <p>{info.quantity ?? '-'}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('tooltips.quantity')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        )
    }, [])

    const IsActiveDetails = useCallback(({ info }: WeaponSegment | SpellSegment) => {
        return info.isActive ? <ActiveIcon className={'size-6'} /> : null
    }, [])

    const UsageDetails = useCallback(({ info }: ItemSegment | WeaponSegment | SpellSegment) => {
        return (
            <>
                <div className={''}>
                    <Tooltip>
                        <TooltipTrigger className={'cursor-default'}>
                            <div className={'flex flex-row items-center gap-1'}>
                                <LocationIcon className={'size-4'} />
                                <p>
                                    {info.userNeedsRange.toString() in RADIUS_TO_COMMON_NAMES
                                        ? t(`radius-alias.${RADIUS_TO_COMMON_NAMES[info.userNeedsRange.toString()]}`)
                                        : info.userNeedsRange.toString()}
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
                                <LuTally5 />
                                {`${info.uses.current ?? '-'}/${info.uses.max ?? '-'}`}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('tooltips.uses')}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </>
        )
    }, [])

    const CostDetails = useCallback(({ info }: ItemSegment | WeaponSegment | SpellSegment) => {
        return (
            <div>
                <Tooltip>
                    <TooltipTrigger className={'cursor-default'}>
                        <div className={'flex flex-row items-center gap-1 text-base'}>
                            <PiSneakerMoveFill />
                            <p>{info.cost ?? '-'}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>{t('tooltips.cost')}</TooltipContent>
                </Tooltip>
            </div>
        )
    }, [])

    const CooldownDetails = useCallback(({ info }: ItemSegment | WeaponSegment | SpellSegment) => {
        return (
            <div>
                <Tooltip>
                    <TooltipTrigger className={'cursor-default'}>
                        <div className={'flex flex-row items-center gap-1'}>
                            <PiClockCountdownBold className={'size-5'} />
                            <p
                                style={{
                                    margin: '0',
                                    fontSize: '1rem',
                                    color: 'black',
                                }}
                            >
                                {info.cooldown ? `${info.cooldown.current ?? '-'}/${info.cooldown.max ?? '-'}` : '-'}
                            </p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('tooltips.cooldown')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        )
    }, [])

    const EffectDurationDetails = useCallback(({ info }: StatusEffectSegment) => {
        return (
            <div>
                <Tooltip>
                    <TooltipTrigger className={'cursor-default'}>
                        <div className={'flex items-center gap-1'}>
                            <FaHourglassHalf className={'size-5'} />
                            {info.duration === null ? (
                                <BiInfinite className={'size-5'} />
                            ) : (
                                <p>{info.duration ?? '-'}</p>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className={'text-base font-normal'}>
                        <p>{t('tooltips.duration')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        )
    }, [])

    return (
        <SeparatedDiv
            className={
                'border-container-medium relative flex w-full max-w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-3'
            }
        >
            <div id={'main-info'} className={'flex w-full flex-row justify-between overflow-hidden text-xl font-bold'}>
                <div className={'flex flex-row items-center gap-2'}>
                    {tNoPrefix(decorations?.name) ?? '???'}
                    {type === 'weapon' && IsActiveDetails({ info } as WeaponSegment)}
                    {type === 'spell' && info.isActive && IsActiveDetails({ info } as SpellSegment)}
                </div>
            </div>
            <div id={'minor-info'} className={'relative flex flex-row justify-between text-base'}>
                <div>
                    {(type === 'item' || type === 'weapon') &&
                        QuantityInfo({
                            type,
                            info,
                        } as ItemSegment | WeaponSegment)}
                    {type !== 'status_effect' &&
                        UsageDetails({
                            type,
                            info,
                        } as ItemSegment | WeaponSegment | SpellSegment)}
                </div>
                <div id={'type-details'} className={'flex-col items-end gap-3'}>
                    {type === 'status_effect' && EffectDurationDetails({ info } as StatusEffectSegment)}
                    {type !== 'status_effect' &&
                        CooldownDetails({
                            type,
                            info,
                        } as ItemSegment | WeaponSegment | SpellSegment)}
                    {type !== 'status_effect' &&
                        CostDetails({
                            type,
                            info,
                        } as ItemSegment | WeaponSegment | SpellSegment)}
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
    )
}

export const WeaponInfoDisplay = ({
    info,
    ...props
}: {
    info: WeaponSegment['info']
} & HTMLAttributes<HTMLDivElement>) => <InfoDisplay type={'weapon'} info={info} {...props} />
export const ItemInfoDisplay = ({ info, ...props }: { info: ItemSegment['info'] } & HTMLAttributes<HTMLDivElement>) => (
    <InfoDisplay type={'item'} info={info} {...props} />
)
export const SpellInfoDisplay = ({
    info,
    ...props
}: {
    info: SpellSegment['info']
} & HTMLAttributes<HTMLDivElement>) => <InfoDisplay type={'spell'} info={info} {...props} />
export const StatusEffectInfoDisplay = ({
    info,
    ...props
}: {
    info: StatusEffectSegment['info']
} & HTMLAttributes<HTMLDivElement>) => <InfoDisplay type={'status_effect'} info={info} {...props} />
