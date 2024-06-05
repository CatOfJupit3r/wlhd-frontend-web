import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ItemInfo, SpellInfo, StatusEffectInfo, WeaponInfo } from '../../../models/Battlefield'
import ElementWithIcon from '../../ElementWithIcon/ElementWithIcon'
import styles from './InfoDisplay.module.css'

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

type InfoSegmentProps = WeaponSegment | ItemSegment | SpellSegment | StatusEffectSegment

const InfoDisplay = ({ type, info }: InfoSegmentProps) => {
    const { t } = useTranslation()
    const { decorations } = info

    const tPath = useMemo(() => 'local:game.info_display.', [])

    const ItemExclusives = useCallback(({ info }: ItemSegment | WeaponSegment) => {
        if (info) return <p>{t(tPath + 'quantity', {
            quantity: info.quantity || 1
        })}</p>
    }, [])

    const IsActiveWeaponDetails = useCallback(({ info }: WeaponSegment) => {
        return info.isActive ? (
            <img
                src={'/assets/local/available_icon.svg'}
                style={{
                    width: '1.25rem',
                    height: '1.25rem',
                }}
                alt={'available'}
            />
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
                    <p>{t(tPath + 'uses', { uses: `${info.uses.current || '0'}|${info.uses.max || '0'}`})}</p>
                )}
            </div>
        )
    }, [])

    const CostDetails = useCallback(({ info }: ItemSegment | WeaponSegment | SpellSegment) => {
        return <p>{t(tPath + 'cost', {
            cost: info.cost || 0
        })}</p>
    }, [])

    const CooldownDetails = useCallback(({ info }: ItemSegment | WeaponSegment | SpellSegment) => {
        return (
            <ElementWithIcon
                icon={
                    <img
                        src={'/assets/local/cooldown.png'}
                        style={{
                            width: '1.25rem',
                            height: '1.25rem',
                        }}
                        alt={'cooldown'}
                    />
                }
                element={
                    <p
                        style={{
                            margin: '0',
                            fontSize: '1rem',
                            color: 'black',
                        }}
                    >
                        {info.cooldown.max !== null
                            ? `${info.cooldown.current || '0'}|${info.cooldown.max || '0'}`
                            : info.cooldown.current || '0'}
                    </p>
                }
            />
        )
    }, [])

    return (
        <div className={styles.infoSegmentContainer}>
            <div id={'main-info'} className={styles.infoSegmentHeading}>
                <div
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    {t(decorations.name)}
                    {type === 'weapon' && IsActiveWeaponDetails({ info } as WeaponSegment)}
                    {type === 'spell' && info.isActive && IsActiveWeaponDetails({ info } as WeaponSegment)}
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
