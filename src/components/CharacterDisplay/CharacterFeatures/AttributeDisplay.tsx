import React, { useCallback, useMemo } from 'react'
import { EntityAttributes } from '@models/Battlefield'
import { useTranslation } from 'react-i18next'
import capitalizeFirstLetter from '@utils/capitalizeFirstLetter'
import { Separator } from '@components/ui/separator'

const includeApArmorHealth = (ignored: Array<string>): boolean => {
    return (
        ignored.includes('builtins:current_health') &&
        ignored.includes('builtins:max_health') &&
        ignored.includes('builtins:current_action_points') &&
        ignored.includes('builtins:max_action_points') &&
        ignored.includes('builtins:current_armor') &&
        ignored.includes('builtins:base_armor')
    )
}

const Attribute = ({ name, value }: { name: string; value: string }) => {
    return (
        <div className={'mb-0.5 flex flex-row justify-between text-t-small'}>
            <p className={'font-normal'}>{capitalizeFirstLetter(name)}</p>
            <p className={'font-bold'}>{value}</p>
        </div>
    )
}

const AttributeDisplay = ({ attributes, ignore }: { attributes: EntityAttributes; ignore: Array<string> }) => {
    const { t } = useTranslation()
    const ignored = ignore

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
                addIgnored(attribute)
            }
        }
        return found_attributes
    }, [attributes])

    const healthAPDefenseValues = useMemo((): { [p: string]: string } => {
        return {
            health:`${attributes['builtins:current_health'] || '-'}/${attributes['builtins:max_health'] || '-'}`,
            actionPoints: `${attributes['builtins:current_action_points'] || '0'}/${attributes['builtins:max_action_points'] || '-'}`,
            armor: `${attributes['builtins:current_armor'] || '-'}/${attributes['builtins:base_armor'] || '-'}`
        }
    }, [attributes])

    const HealthAPDefenseComponent = useCallback(() => {
        return (
            <>
                <Attribute name={'builtins:health'} value={healthAPDefenseValues.health} />
                <Attribute name={'builtins:action_points'} value={healthAPDefenseValues.actionPoints} />
                <Attribute name={'builtins:armor'} value={healthAPDefenseValues.armor} />
            </>
        )
    }, [healthAPDefenseValues])

    const CommonAttributesComponent = useCallback(
        () => (
            <>
                {Object.keys(attributes).map((attribute, index) => {
                    if (ignored.includes(attribute)) return null
                    return (
                        <Attribute
                            name={t(attribute)}
                            value={attributes[attribute] || '-'}
                            key={`common-attr-${index}`}
                        />
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
                        <Attribute
                            name={t(attribute)}
                            value={`${defense_attackAttributes[attribute].attack || '-'} / ${
                                defense_attackAttributes[attribute].defense || '-'
                            }`}
                            key={`special-attr-${index}`}
                        />
                    )
                })}
            </>
        ),
        [defense_attackAttributes]
    )

    return (
        <div className={'flex flex-col gap-2 text-t-small'}>
            {includeApArmorHealth(ignore) && (
                <div>
                    <HealthAPDefenseComponent />
                </div>
            )}
            <Separator />
            <div>
                <CommonAttributesComponent />
            </div>
            <Separator />
            <div>
                <AttackDefenseAttributesComponent />
            </div>
            <Separator />
        </div>
    )
}

export default AttributeDisplay
