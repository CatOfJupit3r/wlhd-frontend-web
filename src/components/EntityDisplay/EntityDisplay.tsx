import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { EntityInfoFull } from '../../models/Battlefield'
import ElementWithIcon from '../ElementWithIcon/ElementWithIcon'
import ToggleContainer from '../ToggleContainer/ToggleContainer'
import styles from './EntityDisplay.module.css'
import { generateAssetPath, generateAssetPathFullDescriptor } from '../Battlefield/utils'
import InfoDisplay from './InfoDisplay/InfoDisplay'
import { INVALID_ASSET_PATH } from '../../config'
import AttributeDisplay from './AttributeDisplay/AttributeDisplay'

const iconStyle = {
    width: '1.25rem',
    height: '1.25rem',
}

const EntityDisplay = ({ entityInfo }: { entityInfo: EntityInfoFull }) => {
    const { decorations, square, attributes, items, weapons, spells, status_effects } = entityInfo
    const { t } = useTranslation()

    // SPRITE NAME                                     SQUARE
    // SPRITE
    // ICON HEALTH/HEALTH; ICON AP/AP; ICON ARMOR/ARMOR
    // ICON ACTIVE WEAPON NAME
    // TOGGLE_SHOW ICON - "attributes"
    // TOGGLE_SHOW ICON - "spellbook"
    // TOGGLE_SHOW ICON - "weapons"
    // TOGGLE_SHOW ICON - "inventory"
    // TOGGLE_SHOW ICON - "status_effects"

    // available:
    // - armor (0, high, full)
    //
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

    const tExt = useCallback(
        (key: string) => {
            return t(`local:game.entity_display.${key}`)
        }, []
    )


    const LIST_HEADERS = useMemo(
        () => ({
            ATTRIBUTES: {
                element: <div className={styles.entityAttribute}>{tExt('attributes')}</div>,
                icon: <img
                    src="https://via.placeholder.com/50"
                    alt="attributes icon"
                    style={iconStyle}
                />,
                children: () => (
                    <AttributeDisplay attributes={attributes} />
                ),
            },
            SPELLBOOK: {
                element: <div className={styles.entityAttribute}>{tExt('spellbook')}</div>,
                icon: <img src="https://via.placeholder.com/50" alt="spellbook icon" style={iconStyle} />,
                children: () => {
                    return spells && spells.length > 0 ? (
                        spells.map((spell, index) => <InfoDisplay type={'spell'} info={spell} key={index} />)
                    ) : (
                        <div>{tExt('no_spellbook')}</div>
                    )
                },
            },
            STATUS_EFFECTS: {
                element: <div className={styles.entityAttribute}>{tExt('status_effects')}</div>,
                icon: <img src="https://via.placeholder.com/50" alt="status effects icon" style={iconStyle} />,
                children: () => {
                    return status_effects && status_effects.length > 0 ? (
                        status_effects.map((status_effect, index) => (
                            <InfoDisplay type={'status_effect'} info={status_effect} key={index} />
                        ))
                    ) : (
                        <div>{tExt('no_status_effects')}</div>
                    )
                },
            },
            WEAPONRY: {
                element: <div className={styles.entityAttribute}>{tExt('weaponry')}</div>,
                icon: <img src="https://via.placeholder.com/50" alt="weapons icon" style={iconStyle} />,
                children: () => {
                    return weapons && weapons.length > 0 ? (
                        weapons.map((weapon, index) => <InfoDisplay type={'weapon'} info={weapon} key={index} />)
                    ) : (
                        <div>{tExt('no_weaponry')}</div>
                    )
                },
            },
            INVENTORY: {
                element: <div className={styles.entityAttribute}>{tExt('inventory')}</div>,
                icon: <img src="https://via.placeholder.com/50" alt="inventory icon" style={iconStyle} />,
                children: () => {
                    return items && items.length > 0 ? (
                        items.map((item, index) => <InfoDisplay type={'item'} info={item} key={index} />)
                    ) : (
                        <div>{tExt('no_inventory')}</div>
                    )
                },
            },
        }),
        [attributes, items, spells, status_effects, weapons]
    )

    return (
        <div className={styles.displayContainer}>
            <div className={styles.entityHeader}>
                <img
                    src={generateAssetPathFullDescriptor(decorations.sprite)}
                    alt={decorations.name}
                    onError={(event) => {
                        const { src, alt } = event.currentTarget
                        if (src !== INVALID_ASSET_PATH && alt !== 'invalid') {
                            if (['1', '2', '3'].includes(square.line)) {
                                event.currentTarget.src = generateAssetPath('builtins', 'enemy')
                                event.currentTarget.alt = 'enemy'
                            } else {
                                event.currentTarget.src = generateAssetPath('builtins', 'ally')
                                event.currentTarget.alt = 'ally'
                            }
                        } else {
                            event.currentTarget.src = INVALID_ASSET_PATH
                            event.currentTarget.alt = 'invalid'
                        }
                    }}
                    style={{
                        width: '5rem',
                        height: '5rem',
                    }}
                />
                <div className={styles.entityName}>{t(decorations.name)}</div>
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
            {Object.entries(LIST_HEADERS).map(([key, value]) => (
                <ToggleContainer key={key} header={<ElementWithIcon icon={value.icon} element={value.element} />}>
                    {value.children ? value.children() : null}
                </ToggleContainer>
            ))}
        </div>
    )
}

export default EntityDisplay
