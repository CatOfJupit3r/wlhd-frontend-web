import { useCallback, useMemo, useState } from 'react'
import { IconType } from 'react-icons'
import { WiMoonWaxingCrescent4 } from 'react-icons/wi'
import styles from './CharacterFeatures.module.css'
import FeatureContainer from './FeatureContainer'

const CharacterFeatures = () => {
    const [activeTab, setActiveTab] = useState(0)

    const TABS: Array<{
        name: string
        value: 'attributes' | 'spells' | 'inventory' | 'weaponry' | 'statusEffects'
        icon: IconType
    }> = useMemo(
        () => [
            {
                name: 'Attributes',
                value: 'attributes',
                icon: WiMoonWaxingCrescent4,
            },
            {
                name: 'Spells',
                value: 'spells',
                icon: WiMoonWaxingCrescent4,
            },
            {
                name: 'Inventory',
                value: 'inventory',
                icon: WiMoonWaxingCrescent4,
            },
            {
                name: 'Weaponry',
                value: 'weaponry',
                icon: WiMoonWaxingCrescent4,
            },
            {
                name: 'Status Effects',
                value: 'statusEffects',
                icon: WiMoonWaxingCrescent4,
            },
        ],
        [activeTab]
    )

    const currentFeatureTabValue = useCallback(() => TABS[activeTab].value || 'attributes', [activeTab, TABS])

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
                    padding: '0.25rem',
                }}
                className={'border-container-big'}
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
                    height: '100%',
                    padding: '1rem',
                }}
                className={'border-container-big'}
            >
                <FeatureContainer type={currentFeatureTabValue()} />
            </div>
        </div>
    )
}

export default CharacterFeatures
