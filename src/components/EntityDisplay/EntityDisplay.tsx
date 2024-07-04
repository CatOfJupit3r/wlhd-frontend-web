import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { EntityInfoFull } from '../../models/Battlefield'
import { generateAssetPath, generateAssetPathFullDescriptor } from '../Battlefield/utils'
import ElementWithIcon from '../ElementWithIcon/ElementWithIcon'
import ToggleContainer from '../ToggleContainer/ToggleContainer'
import AttributeDisplay from './AttributeDisplay/AttributeDisplay'
import styles from './EntityDisplay.module.css'
import InfoDisplay from './InfoDisplay/InfoDisplay'
import GameAsset from '../GameAsset'

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

    const tPath = useMemo(() => 'local:game.entity_display.', [])

    const getActiveWeapon = useCallback(() => {
        const weapon = weapons.find((weapon) => weapon.isActive)
        return weapon ? t(weapon.decorations.name) : t(tPath + 'nothing_weapon')
    }, [])

    const LIST_HEADERS = useMemo(
        () => ({
            ATTRIBUTES: {
                element: <div className={styles.entityIWillComeUpWithAName}>{t(tPath + 'attributes')}</div>,
                icon: <img src="/assets/cr/attributes.svg" alt="attributes icon" style={iconStyle} />,
                children: () => <AttributeDisplay attributes={attributes} />,
            },
            SPELLBOOK: {
                element: <div className={styles.entityIWillComeUpWithAName}>{t(tPath + 'spellbook')}</div>,
                icon: <img src="/assets/cr/spell_book.svg" alt="spellbook icon" style={iconStyle} />,
                children: () => {
                    return spells && spells.length > 0 ? (
                        spells.map((spell, index) => <InfoDisplay type={'spell'} info={spell} key={index} />)
                    ) : (
                        <div>{t(tPath + 'no_spellbook')}</div>
                    )
                },
            },
            STATUS_EFFECTS: {
                element: <div className={styles.entityIWillComeUpWithAName}>{t(tPath + 'status_effects')}</div>,
                icon: <img src="/assets/cr/status_effects.svg" alt="status effects icon" style={iconStyle} />,
                children: () => {
                    return status_effects && status_effects.length > 0 ? (
                        status_effects.map((status_effect, index) => (
                            <InfoDisplay type={'status_effect'} info={status_effect} key={index} />
                        ))
                    ) : (
                        <div>{t(tPath + 'no_status_effects')}</div>
                    )
                },
            },
            WEAPONRY: {
                element: <div className={styles.entityIWillComeUpWithAName}>{t(tPath + 'weaponry')}</div>,
                icon: <img src="/assets/cr/weaponry.svg" alt="weapons icon" style={iconStyle} />,
                children: () => {
                    return weapons && weapons.length > 0 ? (
                        weapons.map((weapon, index) => <InfoDisplay type={'weapon'} info={weapon} key={index} />)
                    ) : (
                        <div>{t(tPath + 'no_weaponry')}</div>
                    )
                },
            },
            INVENTORY: {
                element: <div className={styles.entityIWillComeUpWithAName}>{t(tPath + 'inventory')}</div>,
                icon: <img src="/assets/cr/inventory.svg" alt="inventory icon" style={iconStyle} />,
                children: () => {
                    return items && items.length > 0 ? (
                        items.map((item, index) => <InfoDisplay type={'item'} info={item} key={index} />)
                    ) : (
                        <div>{t(tPath + 'no_inventory')}</div>
                    )
                },
            },
        }),
        [attributes, items, spells, status_effects, weapons]
    )

    const MAIN_ATTRIBUTES = useMemo(
        () => ({
            HEALTH: {
                icon: {
                    src: '/assets/cr/hp.svg',
                    alt: 'Health',
                },
                text: `${attributes['builtins:current_health']}/${attributes['builtins:max_health']}`,
            },
            ARMOR: {
                icon: {
                    src: '/assets/cr/armor.svg',
                    alt: 'Armor',
                },
                text: `${attributes['builtins:current_armor']}/${attributes['builtins:base_armor']}`,
            },
            AP: {
                icon: {
                    src: '/assets/cr/ap.svg',
                    alt: 'Action Points',
                },
                text: `${attributes['builtins:current_action_points']}/${attributes['builtins:max_action_points']}`,
            },
        }),
        [attributes]
    )

    return (
        <div className={[styles.displayContainer, 'border-container-biggest'].join(' ')}>
            <div className={styles.entityHeader}>
                <GameAsset
                    src={generateAssetPathFullDescriptor(decorations.sprite)}
                    alt={decorations.name}
                    fallback={
                        (['1', '2', '3'].includes(square.line)) ? {
                            src: generateAssetPath('builtins', 'enemy'),
                            alt: 'enemy',
                        } : {
                            src: generateAssetPath('builtins', 'ally'),
                            alt: 'ally',
                        }
                    }
                    style={{
                        width: '5rem',
                        height: '5rem',
                    }}
                />
                <div className={styles.entityName}>{t(decorations.name)}</div>
                <div className={styles.entitySquare}>{`${square.line}|${square.column}`}</div>
            </div>
            <div className={styles.entityAttributesDefined}>
                {Object.entries(MAIN_ATTRIBUTES).map(([key, value]) => (
                    <ElementWithIcon
                        key={key}
                        icon={<img src={value.icon.src} alt={value.icon.alt} style={iconStyle} />}
                        element={<p style={{ margin: 0 }}>{value.text}</p>}
                    />
                ))}
            </div>
            <div className={styles.entityActiveWeapon}>
                <div className={styles.entityActiveWeaponName}>
                    {t(tPath + 'equipped', {
                        slot: getActiveWeapon(),
                    })}
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    borderTop: '0.125rem solid #000',
                    padding: '1rem 1rem'
                }}
            >
                {Object.entries(LIST_HEADERS).map(([key, value]) => (
                    <ToggleContainer
                        key={key}
                        header={<ElementWithIcon icon={value.icon} element={value.element} />}
                        className={[styles.attributeToggle, 'border-container-big'].join(' ')}
                    >
                        {value.children ? value.children() : null}
                    </ToggleContainer>
                ))}
            </div>
        </div>
    )
}

export default EntityDisplay
