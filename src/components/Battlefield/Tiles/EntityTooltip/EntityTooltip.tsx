import { useCallback, useMemo } from 'react'
import { Placeholder } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import useTranslatableString from '../../../../hooks/useTranslatableString'
import { selectEntityTooltips } from '../../../../redux/slices/infoSlice'
import styles from './EntityTooltip.module.css'

const EntityTooltip = ({ id }: { id: string }) => {
    const { tstring } = useTranslatableString()
    const entities_info = useSelector(selectEntityTooltips)
    const { t } = useTranslation()

    const generatePlaceholder = useCallback(
        (key: string, glow: boolean = true) => {
            return (
                <Placeholder
                    as="p"
                    animation={glow ? 'glow' : undefined}
                    style={{
                        marginBottom: key === t('game:components:tooltip:status_effects') ? '0' : '7px',
                    }}
                    key={key}
                >
                    <Placeholder bg="light" key={`${key}-bg`}>
                        {t(key)}{' '}
                    </Placeholder>
                </Placeholder>
            )
        },
        [t]
    )

    const emptyTooltipContent = useMemo(() => {
        return [
            t('game:components:tooltip:creature_and_line'),
            t('game:components:tooltip:health_max_health'),
            t('game:components:tooltip:action_points'),
            t('game:components:tooltip:armor'),
            t('game:components:tooltip:status_effects', {
                status_effects: t('game:components:tooltip:no_status_effects'),
            }),
        ]
    }, [t])

    const generateTooltipContent = useCallback(() => {
        const entity_info = entities_info ? entities_info[id] : undefined
        if (!entities_info || !entity_info) {
            return emptyTooltipContent.map((key) => (
                <>
                    {generatePlaceholder(key, false)}
                    <Placeholder as="br" animation="glow" key={`br-${key}`} />
                </>
            ))
        }
        const { name, square, health, action_points, armor, status_effects } = entity_info
        return [
            t('local:game.components.tooltip.creature_and_line', {
                name: tstring(name),
                square: `${square.line}|${square.column}`,
            }),
            t('local:game.components.tooltip.health_max_health', {
                current_health: health.current,
                max_health: health.max,
            }),
            t('local:game.components.tooltip.action_points', {
                current_action_points: action_points.current,
                max_action_points: action_points.max,
            }),
            t('local:game.components.tooltip.armor', { current_armor: armor.current, base_armor: armor.base }),
            t('local:game.components.tooltip.status_effects', {
                status_effects: (() => {
                    return status_effects && status_effects.length > 0
                        ? status_effects.map((value) => `${tstring(value.descriptor)} (${value.duration})`).join(', ')
                        : t('local:game.components.tooltip.no_status_effects')
                })(),
            }),
        ].map((key, index) => <p key={index}>{key}</p>)
    }, [entities_info, emptyTooltipContent, t, id, generatePlaceholder])

    return (
        <div className={styles.tooltip} style={{ opacity: 0.95 }}>
            {generateTooltipContent()}
        </div>
    )
}

export default EntityTooltip
