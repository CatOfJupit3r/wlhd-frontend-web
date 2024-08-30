import AttributesEditor from '@components/CharacterEditor/GameComponentEditors/AttributesEditor'
import InventoryEditor from '@components/CharacterEditor/GameComponentEditors/InventoryEditor'
import SpellBookEditor from '@components/CharacterEditor/GameComponentEditors/SpellBookEditor'
import StatusEffectsEditor from '@components/CharacterEditor/GameComponentEditors/StatusEffectsEditor'
import WeaponryEditor from '@components/CharacterEditor/GameComponentEditors/WeaponryEditor'
import CharacterMainInfoEditor from '@components/CharacterEditor/MainAreaEditors/CharacterMainInfoEditor'
import { AttributesIcon, InventoryIcon, SpellsIcon, StatusEffectsIcon, WeaponryIcon } from '@components/icons'
import Menu, { MenuSelection } from '@components/ui/menu'
import { Separator } from '@components/ui/separator'
import { useCharacterEditorContext } from '@context/CharacterEditorProvider'
import { cn } from '@utils'
import { useMemo } from 'react'

const CharacterEditor = ({ className }: { className?: string }) => {
    const { flags } = useCharacterEditorContext()
    const { exclude } = flags
    const menus: MenuSelection = useMemo(() => {
        return [
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
        ].map((menu) => {
            return {
                ...menu,
                disabled: !!(exclude && exclude[menu.value]),
            }
        }) as MenuSelection
    }, [flags])
    /*

    Editor requires following components:
    - CharacterEditorProvider.tsx
    - GameDataProvider.tsx

    If you don't wrap this component with those providers, it will throw an error.

     */

    return (
        <div className={cn('relative flex w-[30rem] flex-col gap-4 border-2 p-4 text-left transition-all', className)}>
            <CharacterMainInfoEditor />
            <Separator className={'mt-4'} />
            <Menu selection={menus} />
        </div>
    )
}

export default CharacterEditor
