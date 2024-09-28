import { ActiveIcon, LocationIcon } from '@components/icons'
import { Separator } from '@components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { ItemInfo, PossibleMemory, SpellInfo, StatusEffectInfo, WeaponInfo } from '@models/GameModels'
import { capitalizeFirstLetter } from '@utils'
import React, { HTMLAttributes, useCallback } from 'react'
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

const ComponentMemory: React.FC<
    {
        memory: PossibleMemory
    } & HTMLAttributes<HTMLLIElement>
> = ({ memory, ...props }) => {
    const { t } = useTranslation()
    const { type, value, display_name, internal } = memory

    const DisplayedValue = useCallback(() => {
        let displayed = ''

        switch (type) {
            case 'dice':
                if (typeof value == 'object' && value && 'amount' in value && 'sides' in value) {
                    displayed = t('local:game.info_display.memories.dice', {
                        amount: value.amount,
                        sides: value.sides,
                    })
                }
                break
            default:
                displayed = JSON.stringify(value)
                break
        }

        return <p className={internal ? 'text-gray-400' : ''}>{displayed}</p>
    }, [memory])

    return (
        <li className={'flex flex-row gap-1'} {...props}>
            <p>{capitalizeFirstLetter(t(display_name))}</p> : <DisplayedValue />
        </li>
    )
}

const InfoDisplay = ({ type, info }: InfoSegmentProps) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.info_display',
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
                        <div className={'flex flex-row items-center gap-1 text-t-small'}>
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
                    <TooltipContent className={'text-t-small font-normal'}>
                        <p>{t('tooltips.duration')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        )
    }, [])

    const ComponentMemories = useCallback(() => {
        const { memory: memories } = info

        if (!memories || Object.keys(memories).length === 0) {
            return null
        }
        return (
            <div id={'method-variables'} className={'mt-2 flex flex-col items-center gap-1 px-8 text-t-small'}>
                <ul>
                    {Object.entries(memories)
                        .filter(([_, memory]) => !memory.internal)
                        .map(([_, memory], index) => {
                            return <ComponentMemory key={index} memory={memory} />
                        })}
                </ul>
            </div>
        )
    }, [info])

    return (
        <TooltipProvider>
            <div
                className={
                    'border-container-medium relative flex w-full max-w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-3'
                }
            >
                <div
                    id={'main-info'}
                    className={'flex w-full flex-row justify-between overflow-hidden text-t-normal font-bold'}
                >
                    <div className={'flex flex-row items-center gap-2'}>
                        {tNoPrefix(decorations?.name) ?? '???'}
                        {type === 'weapon' && IsActiveDetails({ info } as WeaponSegment)}
                        {type === 'spell' && info.isActive && IsActiveDetails({ info } as SpellSegment)}
                    </div>
                    {type === 'status_effect' && EffectDurationDetails({ info } as StatusEffectSegment)}
                </div>
                <Separator />
                <div id={'minor-info'} className={'relative flex flex-col text-t-small'}>
                    <div id={'type-details'} className={'absolute right-0 top-0 flex flex-row items-center gap-3'}>
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
                <Separator />
                <div id={'description'} className={'break-words text-t-smaller italic text-gray-400'}>
                    {tNoPrefix(decorations?.description) ?? '???'}
                </div>
                <Separator />
                <ComponentMemories />
            </div>
        </TooltipProvider>
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
