import AttributesEditor from '@components/CharacterEditor/GameComponentEditors/AttributesEditor'
import CharacterMiscEditor from '@components/CharacterEditor/GameComponentEditors/CharacterMiscEditor'
import ComponentContainerEditor from '@components/CharacterEditor/GameComponentEditors/ComponentContainerEditor'
import { AttributesIcon, InventoryIcon, SpellBookIcon, StatusEffectsIcon, WeaponryIcon } from '@components/icons'
import { EmptyMenuContent } from '@components/ui/menu'
import { Separator } from '@components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@components/ui/toggle-group'
import { useCharacterEditorContext } from '@context/CharacterEditorProvider'
import { useState } from 'react'
import { MdOutlineAutoAwesomeMosaic } from 'react-icons/md'

export const CharacterEditorMenus = () => {
    const { flags } = useCharacterEditorContext()
    const [menu, setMenu] = useState<null | 'attribute' | 'item' | 'weapon' | 'spell' | 'statusEffect' | string>(null)

    return (
        <div className={'flex flex-col gap-4'}>
            <ToggleGroup
                type={'single'}
                onValueChange={(value) => {
                    if (value === menu) {
                        setMenu(null)
                    } else if (value !== menu) {
                        setMenu(value)
                    }
                }}
            >
                {[
                    {
                        value: 'attribute',
                        icon: AttributesIcon,
                        disabled: flags.exclude?.attributes,
                    },
                    {
                        value: 'item',
                        icon: InventoryIcon,
                        disabled: flags.exclude?.inventory,
                    },
                    {
                        value: 'weapon',
                        icon: WeaponryIcon,
                        disabled: flags.exclude?.weaponry,
                    },
                    {
                        value: 'spell',
                        icon: SpellBookIcon,
                        disabled: flags.exclude?.spellBook,
                    },
                    {
                        value: 'statusEffect',
                        icon: StatusEffectsIcon,
                        disabled: flags.exclude?.statusEffects,
                    },
                    {
                        value: 'misc',
                        icon: MdOutlineAutoAwesomeMosaic,
                        disabled: flags.exclude?.characterMemory,
                    },
                ]
                    .map(({ value, icon, disabled }) => (
                        <ToggleGroupItem key={value} value={value} disabled={disabled ?? false}>
                            {icon({ className: 'size-8' })}
                        </ToggleGroupItem>
                    ))
                    .sort((a, b) => {
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
            <div>
                {(() => {
                    switch (menu) {
                        case 'attribute':
                            return <AttributesEditor />
                        case 'misc':
                            return <CharacterMiscEditor />
                        case 'item':
                        case 'weapon':
                        case 'spell':
                        case 'statusEffect':
                            return <ComponentContainerEditor type={menu} />
                        default:
                            return <EmptyMenuContent />
                    }
                })()}
            </div>
        </div>
    )
}
