import React, { useMemo } from 'react'
import { AttributesIcon, InventoryIcon, SpellsIcon, StatusEffectsIcon, WeaponryIcon } from '@components/icons'
import { EntityInfoFull } from '@models/Battlefield'
import FeatureContainer from '@components/CharacterDisplay/CharacterFeatures/FeatureContainer'
import Menu, { MenuSelection } from '@components/ui/menu'

const CharacterMenus: Array<{
    value: string
    label: string
    icon: React.FC<{ className: string }>
}> = [
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
            return !info.statusEffects || info.statusEffects.length === 0
        case 'weaponry':
            return !info.weaponry || info.weaponry.length === 0
        case 'spells': {
            const spellBook = info.spellBook
            return !spellBook || spellBook.spells.length === 0
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
    const menus: MenuSelection = useMemo(
        () =>
            CharacterMenus.map((menu) => {
                return {
                    value: menu.value,
                    component: () => <FeatureContainer type={menu.value} info={character} flags={flags} />,
                    icon: menu.icon,
                    disabled: MenuIsDisabled(menu.value, character),
                }
            }),
        [character, flags]
    )

    return <Menu selection={menus} />
}

export default CharacterFeatures
