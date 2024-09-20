import BasicCharacterAttributes from '@components/CharacterDisplay/BasicCharacterAttributes'
import { StaticSkeleton } from '@components/ui/skeleton'
import { EntityInfoTooltip } from '@models/GameModels'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './EntityTooltip.module.css'

const EntityTooltip = ({ character }: { character: EntityInfoTooltip }) => {
    const { t } = useTranslation()

    const PlaceholderTooltip = useCallback(() => {
        return (
            <>
                <div className={'flex flex-row gap-2'}>
                    <StaticSkeleton className={'h-6 w-[10ch]'} />
                    <StaticSkeleton className={'h-6 w-[3ch]'} />
                </div>
                <BasicCharacterAttributes
                    attributes={{
                        'builtins:current_health': 0,
                        'builtins:max_health': 0,
                        'builtins:current_action_points': 0,
                        'builtins:max_action_points': 0,
                        'builtins:current_armor': 0,
                        'builtins:base_armor': 0,
                    }}
                />
                <div className={'flex flex-row gap-2'}>
                    <StaticSkeleton className={'h-4 w-[12ch]'} />
                    <StaticSkeleton className={'h-4 w-[10ch]'} />
                    <StaticSkeleton className={'h-4 w-[6ch]'} />
                </div>
                <div className={'flex flex-row gap-2'}>
                    <StaticSkeleton className={'h-4 w-[8ch]'} />
                    <StaticSkeleton className={'h-4 w-[7ch]'} />
                    <StaticSkeleton className={'h-4 w-[12ch]'} />
                </div>
            </>
        )
    }, [])

    const RealContent = useCallback(() => {
        if (!character) {
            return <PlaceholderTooltip />
        }
        const { decorations, square, health, action_points, armor, statusEffects: status_effects } = character
        return (
            <>
                <p className={'text-t-small font-semibold'}>
                    {t(decorations.name)} ({square.line}/{square.column})
                </p>
                <BasicCharacterAttributes
                    attributes={{
                        'builtins:current_health': health.current,
                        'builtins:max_health': health.max,
                        'builtins:current_action_points': action_points.current,
                        'builtins:max_action_points': action_points.max,
                        'builtins:current_armor': armor.current,
                        'builtins:base_armor': armor.base,
                    }}
                />
                <p className={'w-full text-wrap break-all italic'}>
                    {status_effects && status_effects.length > 0
                        ? status_effects
                              .map((value) =>
                                  value.duration !== null
                                      ? `${t(value.decorations.name)} (${value.duration})`
                                      : t(value.decorations.name)
                              )
                              .join(', ')
                        : t('local:game.components.tooltip.no_status_effects')}
                </p>
            </>
        )
    }, [character])

    return (
        <div className={styles.tooltip} style={{ opacity: 0.95 }}>
            {!character ? <PlaceholderTooltip /> : <RealContent />}
        </div>
    )
}

export default EntityTooltip
