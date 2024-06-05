import { useCallback, useMemo, useState } from 'react'
import { WiMoonWaxingCrescent4 } from 'react-icons/wi'
import AttributeDisplay from '../../EntityDisplay/AttributeDisplay/AttributeDisplay'
import InfoDisplay from '../../EntityDisplay/InfoDisplay/InfoDisplay'
import styles from './CharacterFeatures.module.css'
import FeatureProvider from './FeatureProvider'

const CharacterFeatures = () => {
    const [activeTab, setActiveTab] = useState(0)

    const TABS = useMemo(
        () => [
            {
                name: 'Attributes',
                icon: WiMoonWaxingCrescent4,
                content: () => (
                    <FeatureProvider
                        type={'attributes'}
                        component={(data) => <AttributeDisplay attributes={data} includeHealthAPDefense={true} />}
                    />
                ),
            },
            {
                name: 'Spells',
                icon: WiMoonWaxingCrescent4,
                content: () => (
                    <FeatureProvider type={'spell'} component={(data) => <InfoDisplay type={'spell'} info={data} />} />
                ),
            },
            {
                name: 'Inventory',
                icon: WiMoonWaxingCrescent4,
                content: () => (
                    <FeatureProvider type={'item'} component={(data) => <InfoDisplay type={'item'} info={data} />} />
                ),
            },
            {
                name: 'Weaponry',
                icon: WiMoonWaxingCrescent4,
                content: () => (
                    <FeatureProvider
                        type={'weapon'}
                        component={(data) => <InfoDisplay type={'weapon'} info={data} />}
                    />
                ),
            },
            {
                name: 'Status Effects',
                icon: WiMoonWaxingCrescent4,
                content: () => (
                    <FeatureProvider
                        type={'status_effect'}
                        component={(data) => <InfoDisplay type={'status_effect'} info={data} />}
                    />
                ),
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
