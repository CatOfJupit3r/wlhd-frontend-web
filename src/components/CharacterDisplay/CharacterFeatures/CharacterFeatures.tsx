import React, { useState } from 'react'
import { ComboboxItemArray } from '@components/ui/combobox'
import { AttributesIcon, InventoryIcon, SpellsIcon, StatusEffectsIcon, WeaponryIcon } from '@components/icons'
import { EntityInfoFull } from '@models/Battlefield'
import FeatureContainer from '@components/CharacterDisplay/CharacterFeatures/FeatureContainer'
import { ToggleGroup, ToggleGroupItem } from '@components/ui/toggle-group'

const CharacterMenus: ComboboxItemArray = [
    {
        value: 'attributes',
        label: 'Attributes',
        icon: AttributesIcon,
    },
    {
        value: 'status_effects',
        label: 'Status Effects',
        icon: StatusEffectsIcon,
    },
    {
        value: 'inventory',
        label: 'Inventory',
        icon: InventoryIcon,
    },
    {
        value: 'spells',
        label: 'Spells',
        icon: SpellsIcon,
    },
    {
        value: 'weaponry',
        label: 'Weaponry',
        icon: WeaponryIcon,
    },
]

interface CharacterFeaturesProps {
    flags: {
        ignoreAttributes?: Array<string>
    }
    character: EntityInfoFull
}

const CharacterFeatures = ({ character, flags }: CharacterFeaturesProps) => {
    const [currentMenu, setCurrentMenu] = useState<string>('')

    return (
        <div className={'flex flex-col gap-2'}>
            <ToggleGroup
                type={'single'}
                onValueChange={(value) => {
                    setCurrentMenu(value)
                }}
            >
                {CharacterMenus.map((menu) => (
                    <ToggleGroupItem key={menu.value} value={menu.value}>
                        {menu.icon({ className: 'size-8' })}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
            <FeatureContainer type={currentMenu} info={character} flags={flags} />
        </div>
    )
}

export default CharacterFeatures
