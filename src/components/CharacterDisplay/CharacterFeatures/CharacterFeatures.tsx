import React, { useState } from 'react'
import { Combobox, ComboboxItemArray } from '@components/ui/combobox'
import { AttributesIcon, InventoryIcon, SpellsIcon, StatusEffectsIcon, WeaponryIcon } from '@components/icons'
import { EntityInfoFull } from '@models/Battlefield'
import { attributeShowFlags } from '@components/CharacterDisplay/CharacterFeatures/AttributeDisplay'
import FeatureContainer from '@components/CharacterDisplay/CharacterFeatures/FeatureContainer'

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
        attributes?: attributeShowFlags
    }
    character: EntityInfoFull
}

const CharacterFeatures = ({ character, flags }: CharacterFeaturesProps) => {
    const [currentMenu, setCurrentMenu] = useState<string>('')

    return <div className={'flex flex-col gap-2'}>
        <Combobox items={CharacterMenus} value={currentMenu} onChange={setCurrentMenu} size={{
            width: 'min-w-96',
        }}/>
        <FeatureContainer type={currentMenu} info={character} flags={flags} />
    </div>
}

export default CharacterFeatures
