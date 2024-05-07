import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useTranslatableString from '../../hooks/useTranslatableString'
import { EntityInfoFull } from '../../models/Battlefield'
import ElementWithIcon from '../ElementWithIcon/ElementWithIcon'
import ToggleContainer from '../ToggleContainer/ToggleContainer'
import styles from './EntityDisplay.module.css'
import WeaponDisplay from './WeaponDisplay/WeaponDisplay'
import SpellDisplay from './SpellDisplay/SpellDisplay'
import ItemDisplay from './ItemDisplay/ItemDisplay'
import StatusEffectDisplay from './StatusEffectDisplay/StatusEffectDisplay'

const EntityDisplay = ({ entityInfo }: { entityInfo: EntityInfoFull }) => {
    const { name, square, attributes, items, weapons, spells, status_effects } = entityInfo
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

    const LIST_HEADERS = useMemo(
        () => ({
            ATTRIBUTES: {
                element: <div className={styles.entityAttribute}>Attributes:</div>,
                icon: (
                    <img
                        src="https://via.placeholder.com/50"
                        alt="attributes icon"
                        style={{
                            width: '1.25rem',
                            height: '1.25rem',
                        }}
                    />
                ),
                children: () => (
                    <div>
                        {Object.entries(attributes).map(([attribute, value]) =>
                            !ignoredAttributes.find((value) => value === attribute) ? (
                                <div key={attribute} className={styles.entityAttribute}>
                                    {t(attribute)}: {value}
                                </div>
                            ) : null
                        )}
                    </div>
                ),
            },
            SPELLBOOK: {
                element: <div className={styles.entityAttribute}>Spellbook:</div>,
                icon: (
                    <img
                        src="https://via.placeholder.com/50"
                        alt="spellbook icon"
                        style={{
                            width: '1.25rem',
                            height: '1.25rem',
                        }}
                    />
                ),
                children: () => {
                    return spells && spells.length > 0 ? spells.map((spell, index) => (
                        <SpellDisplay spell={spell} key={index}/>
                    )) : <div>No spells</div>
                },
            },
            STATUS_EFFECTS: {
                element: <div className={styles.entityAttribute}>Status effects:</div>,
                icon: (
                    <img
                        src="https://via.placeholder.com/50"
                        alt="status effects icon"
                        style={{
                            width: '1.25rem',
                            height: '1.25rem',
                        }}
                    />
                ),
                children: () => {
                    return status_effects && status_effects.length > 0 ? status_effects.map((status_effect, index) => (
                        <StatusEffectDisplay status_effect={status_effect} key={index}/>
                    )) : <div>No status effects</div>
                }
            },
            WEAPONRY: {
                element: <div className={styles.entityAttribute}>Weapons:</div>,
                icon: (
                    <img
                        src="https://via.placeholder.com/50"
                        alt="weapons icon"
                        style={{
                            width: '1.25rem',
                            height: '1.25rem',
                        }}
                    />
                ),
                children: () => {
                    return weapons && weapons.length > 0 ? weapons.map((weapon, index) => (
                        <WeaponDisplay weapon={weapon} key={index}/>
                    )) : <div>No weapons</div>
                }
            },
            INVENTORY: {
                element: <div className={styles.entityAttribute}>Inventory:</div>,
                icon: (
                    <img
                        src="https://via.placeholder.com/50"
                        alt="inventory icon"
                        style={{
                            width: '1.25rem',
                            height: '1.25rem',
                        }}
                    />
                ),
                children: () => {
                    return items && items.length > 0 ? items.map((item, index) => (
                        <ItemDisplay item={item} key={index}/>
                    )) : <div>No spells</div>
                },
            },
        }),
        [attributes, ignoredAttributes, items, spells, status_effects, weapons]
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
            <div className={styles.entityActiveWeapon}>
                <div className={styles.entityActiveWeaponName}>Active weapon: {getActiveWeapon()}</div>
            </div>
            {
                Object.entries(LIST_HEADERS).map(([key, value]) => (
                    <ToggleContainer
                        key={key}
                        header={
                            <ElementWithIcon icon={value.icon} element={value.element} />
                        }
                    >
                        {value.children ? value.children() : null}
                    </ToggleContainer>
                ))
            }
        </div>
    )
}

export default EntityDisplay
