import ElementWithIcon from '@components/ElementWithIcon'
import { ItemInfo, SpellInfo, StatusEffectInfo, WeaponInfo } from '@models/Battlefield'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './InfoDisplay.module.css'
import { ActiveIcon, CooldownIcon } from '@components/icons'
import { cn } from '@utils'

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

const InfoDisplay = ({ type, info }: InfoSegmentProps) => {
    const { t } = useTranslation()
    const { decorations } = info

    const tPath = useMemo(() => 'local:game.info_display.', [])

    const ItemExclusives = useCallback(({ info }: ItemSegment | WeaponSegment) => {
        if (info)
            return (
                <p>
                    {t(tPath + 'quantity', {
                        quantity: info.quantity || '-',
                    })}
                </p>
            )
    }, [])

    const IsActiveDetails = useCallback(({ info }: WeaponSegment) => {
        return info.isActive ? (
            <ActiveIcon className={'size-6'} />
        ) : null
    }, [])

    const UsageDetails = useCallback(({ info }: ItemSegment | WeaponSegment | SpellSegment) => {
        return (
            <div id={'usages'} className={styles.infoSegmentUsageDetails}>
                <p>
                    {t(tPath + 'user_must_be', {
                        range: info.user_needs_range
                            ? info.user_needs_range
                                  .map((value: unknown) => {
                                      if (value && !(value instanceof String)) {
                                          return value
                                      }
                                  })
                                  .join(', ')
                            : '???',
                    })}
                </p>
                {info.uses && info.uses.max !== null && (
                    <p>{t(tPath + 'uses', { uses: `${info.uses.current || '-'}|${info.uses.max || '-'}` })}</p>
                )}
            </div>
        )
    }, [])

    const CostDetails = useCallback(({ info }: ItemSegment | WeaponSegment | SpellSegment) => {
        return (
            <p>
                {t(tPath + 'cost', {
                    cost: info.cost || '-',
                })}
            </p>
        )
    }, [])

    const CooldownDetails = useCallback(({ info }: ItemSegment | WeaponSegment | SpellSegment) => {
        return (
            <ElementWithIcon
                icon={<CooldownIcon className={'size-5'} />}
                element={
                    <p
                        style={{
                            margin: '0',
                            fontSize: '1rem',
                            color: 'black',
                        }}
                    >
                        {info.cooldown ? `${info.cooldown.current || '-'} | ${info.cooldown.max || '-'}` : '-'}
                    </p>
                }
            />
        )
    }, [])

    return (
        <div className={cn(styles.infoSegmentContainer, 'border-container-medium')}>
            <div id={'main-info'} className={styles.infoSegmentHeading}>
                <div
                    className={'flex flex-row items-center gap-2'}
                >
                    {t(decorations.name)}
                    {type === 'weapon' && IsActiveDetails({ info } as WeaponSegment)}
                    {type === 'spell' &&
                        info.isActive &&
                        IsActiveDetails({ info } as {
                            isActive: boolean
                        } extends SpellInfo
                            ? SpellSegment
                            : never)}
                </div>
                {type !== 'status_effect' &&
                    CooldownDetails({
                        type,
                        info,
                    } as ItemSegment | WeaponSegment | SpellSegment)}
            </div>
            <div id={'minor-info'} className={styles.infoSegmentMinorInfo}>
                <div id={'type-details'} className={styles.infoSegmentTypeDetails}>
                    {(type === 'item' || type === 'weapon') &&
                        ItemExclusives({ type, info } as ItemSegment | WeaponSegment)}
                    {type !== 'status_effect' &&
                        CostDetails({
                            type,
                            info,
                        } as ItemSegment | WeaponSegment | SpellSegment)}
                </div>
                {type !== 'status_effect' && UsageDetails({ type, info } as ItemSegment | WeaponSegment | SpellSegment)}
            </div>
            <div id={'description'} className={styles.infoSegmentDescription}>
                {t(decorations.description)}
            </div>
        </div>
    )
}

export default InfoDisplay
