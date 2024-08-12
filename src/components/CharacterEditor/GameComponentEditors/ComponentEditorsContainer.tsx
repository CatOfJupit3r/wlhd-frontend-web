import InventoryEditor from '@components/CharacterEditor/GameComponentEditors/InventoryEditor'
import StatusEffectsEditor from '@components/CharacterEditor/GameComponentEditors/StatusEffectsEditor'
import SpellBookEditor from '@components/CharacterEditor/GameComponentEditors/SpellBookEditor'
import WeaponryEditor from '@components/CharacterEditor/GameComponentEditors/WeaponryEditor'
import { AttributesIcon, InventoryIcon, SpellsIcon, StatusEffectsIcon, WeaponryIcon } from '@components/icons'
import React, { useMemo, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@components/ui/toggle-group'
import AttributesEditor from '@components/CharacterEditor/GameComponentEditors/AttributesEditor'
import { EmptyFeatureContent } from '@components/CharacterDisplay/CharacterFeatures/FeatureContainer'
import { useCharacterEditorContext } from '@components/ContextProviders/CharacterEditorProvider'
import { Separator } from '@components/ui/separator'

const CONTAINERS: Array<{
    value: string
    component: React.FC
    icon: React.FC<{ className: string }>
}> = [
    {
        value: 'inventory',
        component: InventoryEditor,
        icon: InventoryIcon,
    },
    {
        value: 'spellbook',
        component: SpellBookEditor,
        icon: SpellsIcon,
    },
    {
        value: 'status_effects',
        component: StatusEffectsEditor,
        icon: StatusEffectsIcon,
    },
    {
        value: 'weaponry',
        component: WeaponryEditor,
        icon: WeaponryIcon,
    },
    {
        value: 'attributes',
        component: AttributesEditor,
        icon: AttributesIcon,
    },
]

const ComponentEditorsContainer = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('')
    const { flags } = useCharacterEditorContext()
    const { exclude } = flags

    const CurrentComponent = useMemo(() => {
        return CONTAINERS.find((container) => container.value === currentMenu)?.component || EmptyFeatureContent
    }, [currentMenu])

    return (
        <div className={'flex flex-col gap-2'}>
            <ToggleGroup
                type={'single'}
                onValueChange={(value) => {
                    setCurrentMenu(value)
                }}
            >
                {CONTAINERS.map((menu) => (
                    <ToggleGroupItem
                        key={menu.value}
                        value={menu.value}
                        disabled={exclude && Object.keys(exclude).includes(menu.value) && !!exclude[menu.value]}
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
            <Separator />
            <CurrentComponent />
        </div>
    )
}

export default ComponentEditorsContainer
