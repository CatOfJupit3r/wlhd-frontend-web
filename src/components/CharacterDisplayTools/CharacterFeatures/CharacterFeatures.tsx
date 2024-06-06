import { useCallback, useMemo, useState } from 'react'
import { WiMoonWaxingCrescent4 } from 'react-icons/wi'
import styles from './CharacterFeatures.module.css'
import FeatureContainer from './FeatureContainer'

const CharacterFeatures = () => {
    const [activeTab, setActiveTab] = useState(0)

    const TABS = useMemo(
        () => [
            {
                name: 'Attributes',
                icon: WiMoonWaxingCrescent4,
                content: () => <FeatureContainer type={'attributes'} />,
            },
            {
                name: 'Spells',
                icon: WiMoonWaxingCrescent4,
                content: () => <FeatureContainer type={'spell'} />,
            },
            {
                name: 'Inventory',
                icon: WiMoonWaxingCrescent4,
                content: () => <FeatureContainer type={'item'} />,
            },
            {
                name: 'Weaponry',
                icon: WiMoonWaxingCrescent4,
                content: () => <FeatureContainer type={'weapon'} />,
            },
            {
                name: 'Status Effects',
                icon: WiMoonWaxingCrescent4,
                content: () => <FeatureContainer type={'status_effect'} />,
            },
        ],
        [activeTab]
    )

    const TabContent = useCallback(() => {
        return TABS[activeTab].content()
    }, [activeTab])

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
                <TabContent />
            </div>
        </div>
    )
}

export default CharacterFeatures
