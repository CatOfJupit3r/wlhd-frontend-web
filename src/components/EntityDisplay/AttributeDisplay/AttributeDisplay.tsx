import { useMemo } from 'react'
import { EntityAttributes } from '../../../models/Battlefield'
import styles from './AttributeDisplay.module.css'
import { useTranslation } from 'react-i18next'

const capitalizeFirstLetter = (string: string) => {
    if (!string) return ''
    if (string.length === 1) return string.toUpperCase()
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const AttributeDisplay = ({ attributes }: { attributes: EntityAttributes }) => {
    const { t } = useTranslation()

    const ignoredAttributes = useMemo(
        () => [
            'builtins:current_health',
            'builtins:max_health',
            'builtins:current_action_points',
            'builtins:max_action_points',
            'builtins:current_armor',
            'builtins:base_armor',
        ],
        []
    )

    const defense_attackAttributes = useMemo(() => {
        const found_attributes: { [key: string]: { attack: string; defense: string } } = {}
        for (const attribute in attributes) {
            if (ignoredAttributes.includes(attribute)) continue
            if (attribute.endsWith('_attack')) {
                const attribute_name = attribute.slice(0, -7)
                if (found_attributes[attribute_name]) {
                    found_attributes[attribute_name].attack = attributes[attribute]
                } else {
                    found_attributes[attribute_name] = { attack: attributes[attribute], defense: '' }
                }
                ignoredAttributes.push(attribute)
            } else if (attribute.endsWith('_defense')) {
                const attribute_name = attribute.slice(0, -8)
                if (found_attributes[attribute_name]) {
                    found_attributes[attribute_name].defense = attributes[attribute]
                } else {
                    found_attributes[attribute_name] = { attack: '', defense: attributes[attribute] }
                }
                ignoredAttributes.push(attribute)
            }
        }
        return found_attributes
    }, [attributes])

    return (
        <div>
            {Object.keys(attributes).map((attribute, index) => {
                if (ignoredAttributes.includes(attribute)) return null
                return (
                    <div className={styles.entityAttribute} key={`common-attr-${index}`}>
                        <p key={`common-attr-name-${index}`}>{capitalizeFirstLetter(t(attribute))}</p>
                        <p key={`common-attr-val-${index}`}>{attributes[attribute]}</p>
                    </div>
                )
            })}
            {Object.keys(defense_attackAttributes).map((attribute, index) => {
                return (
                    <div className={styles.entityAttribute} key={`special-attr-${index}`}>
                        <p key={`special-attr-name-${index}`}>{capitalizeFirstLetter(t(attribute))}</p>
                        <p key={`special-attr-val-${index}`}>
                            {defense_attackAttributes[attribute].attack}/{defense_attackAttributes[attribute].defense}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

export default AttributeDisplay
