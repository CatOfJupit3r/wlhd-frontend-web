import { useEffect, useMemo, useState } from 'react'
import { WiMoonWaxingCrescent4 } from 'react-icons/wi'
import styles from './CharacterFeatures.module.css'
import { CharacterInfo } from '../../../models/CharacterInfo'
import AttributeDisplay from '../../EntityDisplay/AttributeDisplay/AttributeDisplay'

const CharacterFeatures = (props: {
    attributes: CharacterInfo['attributes'],
    spellBook: CharacterInfo['spellBook'],
    spellLayout: CharacterInfo['spellLayout'],
    inventory: CharacterInfo['inventory'],
    weaponry: CharacterInfo['weaponry'],
}) => {
    const [activeTab, setActiveTab] = useState(0)

    const [attributes, setAttributes] = useState({} as CharacterInfo['attributes'])
    const [spellBook, setSpellBook] = useState([] as CharacterInfo['spellBook'])
    const [spellLayout, setSpellLayout] = useState([] as CharacterInfo['spellLayout'])
    const [inventory, setInventory] = useState([] as CharacterInfo['inventory'])
    const [weaponry, setWeaponry] = useState([] as CharacterInfo['weaponry'])

    useEffect(() => {
        setAttributes(props.attributes)
        setSpellBook(props.spellBook)
        setSpellLayout(props.spellLayout)
        setInventory(props.inventory)
        setWeaponry(props.weaponry)
    }, [props])

    const TABS = useMemo(
        () => [
            {
                name: 'Attributes',
                icon: WiMoonWaxingCrescent4,
                content: <AttributeDisplay attributes={attributes} includeHealthAPDefense={true} />,
            },
            {
                name: 'Spells',
                icon: WiMoonWaxingCrescent4,
                content: <div>spells</div>,
            },
            {
                name: 'Inventory',
                icon: WiMoonWaxingCrescent4,
                content: <div>inventory</div>,
            },
            {
                name: 'Weaponry',
                icon: WiMoonWaxingCrescent4,
                content: <div>weaponry</div>,
            },
        ],
        [attributes, inventory, spellBook, spellLayout, weaponry]
    )

    return (
        <div
            className={styles.attributesSpellsInventoryAndWeaponry}
            style={{
                width: '60%',
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '2rem',
                    gap: '0.25rem',
                    width: '100%',
                    border: '0.125rem solid black',
                    borderRadius: '1rem',
                    borderBottom: '0.25rem solid black',
                    padding: '0.25rem',
                }}
            >
                {TABS.map((tab, index) => (
                    <tab.icon
                        key={index}
                        onMouseDown={() => {
                            setActiveTab(index)
                        }}
                    />
                ))}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '100%',
                    border: '0.125rem solid black',
                    borderRadius: '1rem',
                    borderBottom: '0.25rem solid black',
                    height: '100%',
                    padding: '1rem',
                }}
            >
                {TABS[activeTab].content}
            </div>
        </div>
    )
}

export default CharacterFeatures
