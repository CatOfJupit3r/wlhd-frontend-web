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
        value: 'statusEffects',
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

const MenuIsDisabled = (type: string, info: EntityInfoFull) => {
    switch (type) {
        case 'inventory':
            return !info.inventory || info.inventory.length === 0
        case 'statusEffects':
            return !info.status_effects || info.status_effects.length === 0
        case 'weaponry':
            return !info.weaponry || info.weaponry.length === 0
        case 'spells': {
            let spellBook = info.spellBook
            if (!spellBook) {
                spellBook = (info as any).spell_book as typeof info.spellBook
            }
            return !spellBook || spellBook.length === 0
        }
        default:
            return false
    }
}

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
                    <ToggleGroupItem
                        key={menu.value}
                        value={menu.value}
                        disabled={MenuIsDisabled(menu.value, character)}
                    >
                        {menu.icon({ className: 'size-8' })}
                    </ToggleGroupItem>
                )).sort((a, b) => {
                    if (a.props.disabled) {
                        return 1
                    } else if (b.props.disabled) {
                        return -1
                    } else {
                        return a.props.value > b.props.value ? 1 : -1
                    }
                })}
            </ToggleGroup>
            <FeatureContainer type={currentMenu} info={character} flags={flags} />
        </div>
    )
}

export default CharacterFeatures
