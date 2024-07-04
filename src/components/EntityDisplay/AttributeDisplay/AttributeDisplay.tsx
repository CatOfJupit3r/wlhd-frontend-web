import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { EntityAttributes } from '@models/Battlefield'
import capitalizeFirstLetter from '@utils/capitalizeFirstLetter'
import styles from './AttributeDisplay.module.css'

const AttributeDisplay = ({
    attributes,
    includeHealthAPDefense,
}: {
    attributes: EntityAttributes
    includeHealthAPDefense?: boolean
}) => {
    const { t } = useTranslation()

    const ignored = [
        'builtins:current_health',
        'builtins:max_health',
        'builtins:current_action_points',
        'builtins:max_action_points',
        'builtins:current_armor',
        'builtins:base_armor',
    ] // we reset this on each render, thus no useMemo

    const addIgnored = useCallback(
        (attribute: string) => {
            ignored.push(attribute)
        },
        [ignored]
    )

    const defense_attackAttributes = useMemo(() => {
        const found_attributes: { [key: string]: { attack: string; defense: string } } = {}
        for (const attribute in attributes) {
            if (ignored.includes(attribute)) continue
            if (attribute.endsWith('_attack')) {
                const attribute_name = attribute.slice(0, -7)
                if (found_attributes[attribute_name]) {
                    found_attributes[attribute_name].attack = attributes[attribute]
                } else {
                    found_attributes[attribute_name] = { attack: attributes[attribute], defense: '-' }
                }
                addIgnored(attribute)
            } else if (attribute.endsWith('_defense')) {
                const attribute_name = attribute.slice(0, -8)
                if (found_attributes[attribute_name]) {
                    found_attributes[attribute_name].defense = attributes[attribute]
                } else {
                    found_attributes[attribute_name] = { attack: '-', defense: attributes[attribute] }
                }
                ignored.push(attribute)
            }
        }
        return found_attributes
    }, [attributes])

    const healthAPDefenseValues = useMemo(() => {
        return {
            health: `${attributes['builtins:current_health'] || '-'}/${attributes['builtins:max_health'] || '-'}`,
            actionPoints: `${attributes['builtins:current_action_points'] || '0'}/${attributes['builtins:max_action_points'] || '-'}`,
            armor: `${attributes['builtins:current_armor'] || '-'}/${attributes['builtins:base_armor'] || '-'}`,
        }
    }, [attributes])

    const HealthAPDefenseComponent = useCallback(() => {
        return (
            <>
                <div className={styles.entityAttribute}>
                    <p>{capitalizeFirstLetter(t('builtins:health'))}</p>
                    <p>{healthAPDefenseValues.health}</p>
                </div>
                <div className={styles.entityAttribute}>
                    <p>{capitalizeFirstLetter(t('builtins:action_points'))}</p>
                    <p>{healthAPDefenseValues.actionPoints}</p>
                </div>
                <div className={styles.entityAttribute}>
                    <p>{capitalizeFirstLetter(t('builtins:armor'))}</p>
                    <p>{healthAPDefenseValues.armor}</p>
                </div>
            </>
        )
    }, [healthAPDefenseValues])

    const CommonAttributesComponent = useCallback(
        () => (
            <>
                {Object.keys(attributes).map((attribute, index) => {
                    if (ignored.includes(attribute)) return null
                    return (
                        <div className={styles.entityAttribute} key={`common-attr-${index}`}>
                            <p key={`common-attr-name-${index}`}>{capitalizeFirstLetter(t(attribute))}</p>
                            <p key={`common-attr-val-${index}`}>{attributes[attribute] || '-'}</p>
                        </div>
                    )
                })}
            </>
        ),
        [attributes]
    )

    const AttackDefenseAttributesComponent = useCallback(
        () => (
            <>
                {Object.keys(defense_attackAttributes).map((attribute, index) => {
                    return (
                        <div className={styles.entityAttribute} key={`special-attr-${index}`}>
                            <p key={`special-attr-name-${index}`}>{capitalizeFirstLetter(t(attribute))}</p>
                            <p key={`special-attr-val-${index}`}>
                                {defense_attackAttributes[attribute].attack || '-'}/
                                {defense_attackAttributes[attribute].defense || '-'}
                            </p>
                        </div>
                    )
                })}
            </>
        ),
        [defense_attackAttributes]
    )

    return (
        <div className={styles.attributeContainer}>
            {includeHealthAPDefense && <HealthAPDefenseComponent />}
            <CommonAttributesComponent />
            <AttackDefenseAttributesComponent />
        </div>
    )
}

export default AttributeDisplay
