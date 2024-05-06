import { EntityInfoFull } from '../../models/Battlefield'
import styles from './EntityDisplay.module.css'
import useTranslatableString from '../../hooks/useTranslatableString'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const EntityDisplay = ({ entityInfo }: { entityInfo: EntityInfoFull }) => {
    const { name, square, attributes, items, weapons } = entityInfo
    const { tstring } = useTranslatableString()
    const { t } = useTranslation()

    // SPRITE NAME
    // ICON - HEALTH/HEALTH; ICON - AP/AP; ICON - ARMOR/ARMOR
    // ICON - ACTIVE WEAPON NAME
    // TOGGLE_SHOW ICON - "attributes"
    // TOGGLE_SHOW ICON - "spellbook"
    // TOGGLE_SHOW ICON - "weapons"
    // TOGGLE_SHOW ICON - "inventory"
    // TOGGLE_SHOW ICON - "status_effects"

    // available:
    // - armor (0, high, full)
    // required:
    // - health (0, low, medium, high, full),
    // - ap (0, 1, >1), (boots),
    // - armor (low, medium) (shield)
    // - active weapon (sword, glowing sword)
    // - attributes (???)
    // - spellbook (book)
    // - inventory (bag)
    // - weapons (???)
    // - status effects (???)

    const getActiveWeapon = useCallback(() => {
        return weapons.find((weapon) => weapon.isActive)?.descriptor || 'None'
    }, [])

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

    return (
        <div className={styles.displayContainer}>
            <div className={styles.entityHeader}>
                <img src="https://via.placeholder.com/50" alt="entity sprite" />
                <div className={styles.entityName}>
                    {tstring({
                        // TODO: change name to TranslatableString
                        main_string: name,
                    })}
                </div>
                <div className={styles.entitySquare}>{`${square.line}|${square.column}`}</div>
            </div>
            <div className={styles.entityAttributesDefined}>
                <div className={styles.entityAttribute}>
                    Health: {attributes['builtins:current_health']}/{attributes['builtins:max_health']}
                </div>
                <div className={styles.entityAttribute}>
                    AP: {attributes['builtins:current_action_points']}/{attributes['builtins:max_action_points']}
                </div>
                <div className={styles.entityAttribute}>
                    Armor: {attributes['builtins:current_armor']}/{attributes['builtins:base_armor']}
                </div>
            </div>
            <div className={styles.entityAttributesDynamic}>
                <div className={styles.entityAttribute}>Attributes:</div>
                {Object.entries(attributes).map(([attribute, value]) =>
                    !(ignoredAttributes.find((value) => value === attribute)) ? (
                        <div key={attribute} className={styles.entityAttribute}>
                            {t(attribute)}: {value}
                        </div>
                    ) : null
                )}
            </div>
            <div className={styles.entityActiveWeapon}>
                <div className={styles.entityActiveWeaponName}>Active weapon: {getActiveWeapon()}</div>
            </div>
            <div className={styles.entityToggleShow}>Attributes</div>
            <div className={styles.entityToggleShow}>Spellbook</div>
            <div className={styles.entityToggleShow}>Weapons</div>
            <div className={styles.entityToggleShow}>Inventory</div>
            <div className={styles.entityToggleShow}>Status effects</div>
        </div>
    )
}

export default EntityDisplay
