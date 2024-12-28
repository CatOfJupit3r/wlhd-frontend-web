import { Progress } from '@components/ui/progress'
import { CharacterInfoFull } from '@models/GameModels'
import { getPercentage } from '@utils/getPercentage'
import { useMemo } from 'react'
import { GiHeartPlus } from 'react-icons/gi'
import { IoShieldSharp } from 'react-icons/io5'
import { PiSneakerMoveFill } from 'react-icons/pi'

const BasicCharacterAttributes = ({
    attributes,
    flags,
}: {
    attributes: CharacterInfoFull['attributes']
    flags?: {
        ignoreCurrentValues?: boolean
    }
}) => {
    const MAIN_ATTRIBUTES = useMemo(
        () => ({
            HEALTH: {
                current: attributes['builtins:current_health'] ?? 0,
                max: attributes['builtins:max_health'] ?? 0,
                text: flags?.ignoreCurrentValues
                    ? `${attributes['builtins:max_health'] ?? '-'}`
                    : `${attributes['builtins:current_health'] ?? '-'}/${attributes['builtins:max_health'] ?? '-'}`,
            },
            ARMOR: {
                current: attributes['builtins:current_armor'] ?? 0,
                base: attributes['builtins:base_armor'] ?? 0,
                text: flags?.ignoreCurrentValues
                    ? `${attributes['builtins:base_armor'] ?? '-'}`
                    : `${attributes['builtins:current_armor'] ?? '-'}`,
            },
            AP: {
                current: attributes['builtins:current_action_points'] ?? 0,
                max: attributes['builtins:max_action_points'] ?? 0,
                text: flags?.ignoreCurrentValues
                    ? `${attributes['builtins:max_action_points'] ?? '-'}`
                    : `${attributes['builtins:current_action_points'] ?? '-'}/${attributes['builtins:max_action_points'] ?? '-'}`,
            },
        }),
        [attributes, flags]
    )

    return (
        <div className={'flex size-full gap-2'}>
            <div className={'w-10/12 items-center'}>
                <div className={'flex w-full flex-row items-center gap-1'}>
                    <IoShieldSharp className={'size-5 text-gray-700'} />
                    <Progress
                        value={
                            flags?.ignoreCurrentValues
                                ? 100
                                : getPercentage(MAIN_ATTRIBUTES.ARMOR.current, MAIN_ATTRIBUTES.ARMOR.base)
                        }
                        colored={{
                            empty: 'bg-gray-700',
                            fill: 'bg-amber-500',
                        }}
                        className={'rounded-lg'}
                        width={'w-full'}
                        height={'h-2'}
                    />
                    <p className={'min-w-[4ch] text-right text-base font-semibold'}>{MAIN_ATTRIBUTES.ARMOR.text}</p>
                </div>
                <div className={'relative flex w-full flex-row items-center gap-2'}>
                    <Progress
                        value={
                            flags?.ignoreCurrentValues
                                ? 100
                                : getPercentage(MAIN_ATTRIBUTES.HEALTH.current, MAIN_ATTRIBUTES.HEALTH.max)
                        }
                        colored={{
                            empty: 'bg-gray-700',
                            fill: 'bg-red-500',
                        }}
                        className={'rounded-sm'}
                        width={'w-full'}
                        height={'h-8'}
                    />
                    <p
                        className={
                            'absolute inset-0 flex items-center justify-center gap-1 text-base font-semibold text-white'
                        }
                    >
                        {MAIN_ATTRIBUTES.HEALTH.text}
                        <GiHeartPlus className={'size-5'} />
                    </p>
                </div>
            </div>
            <div className={'relative flex grow flex-row items-center gap-2'}>
                <Progress
                    value={
                        flags?.ignoreCurrentValues
                            ? 100
                            : getPercentage(MAIN_ATTRIBUTES.AP.current, MAIN_ATTRIBUTES.AP.max)
                    }
                    colored={{
                        empty: 'bg-gray-700',
                        fill: 'bg-green-500',
                    }}
                    className={'rounded-lg'}
                    width={'w-full'}
                    height={'h-full'}
                    direction={'up-to-down'}
                />
                <p
                    className={
                        'absolute inset-0 flex items-center justify-center gap-2 text-base font-semibold text-white'
                    }
                >
                    {MAIN_ATTRIBUTES.AP.text}
                </p>
                <PiSneakerMoveFill
                    className={`absolute inset-0 flex size-full items-center justify-center gap-2 overflow-x-clip text-base font-semibold text-white opacity-20`}
                />
            </div>
        </div>
    )
}

export default BasicCharacterAttributes
