import { useCallback, useMemo, useState } from 'react'
import { IconType } from 'react-icons'
import FeatureContainer from './FeatureContainer'
import { AttributesIcon, InventoryIcon, SpellsIcon, StatusEffectsIcon, WeaponryIcon } from '@components/icons'
import { IconComponentType } from '@components/icons/icon_factory'

const CharacterFeatures = () => {
    const [activeTab, setActiveTab] = useState(0)

    const TABS: Array<{
        name: string
        value: 'attributes' | 'spells' | 'inventory' | 'weaponry' | 'statusEffects'
        icon: IconType | IconComponentType
    }> = useMemo(
        () => [
            {
                name: 'Attributes',
                value: 'attributes',
                icon: AttributesIcon,
            },
            {
                name: 'Spells',
                value: 'spells',
                icon: SpellsIcon,
            },
            {
                name: 'Inventory',
                value: 'inventory',
                icon: InventoryIcon,
            },
            {
                name: 'Weaponry',
                value: 'weaponry',
                icon: WeaponryIcon,
            },
            {
                name: 'Status Effects',
                value: 'statusEffects',
                icon: StatusEffectsIcon,
            },
        ],
        [activeTab]
    )

    const currentFeatureTabValue = useCallback(() => TABS[activeTab].value || 'attributes', [activeTab, TABS])

    return (
        <div className={'border-container-big flex size-full flex-col gap-4 p-4'}>
            <div className={'border-container-big flex h-12 w-full flex-row gap-1 p-1 align-middle'}>
                {TABS.map((tab, index) => (
                    <tab.icon
                        className={'size-8 cursor-pointer'}
                        key={index}
                        onMouseDown={() => {
                            setActiveTab(index)
                        }}
                    />
                ))}
            </div>
            <div className={'border-container-big flex size-full flex-col gap-4 p-4'}>
                <FeatureContainer type={currentFeatureTabValue()} />
            </div>
        </div>
    )
}

export default CharacterFeatures
