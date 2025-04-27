import AttributesEditor from '@components/CharacterEditor/GameComponentEditors/AttributesEditor';
import CharacterMiscEditor from '@components/CharacterEditor/GameComponentEditors/CharacterMiscEditor';
import ComponentContainerEditor from '@components/CharacterEditor/GameComponentEditors/ComponentContainerEditor';
import {
    AttributesIcon,
    InventoryIcon,
    MiscIcon,
    SpellBookIcon,
    StatusEffectsIcon,
    WeaponryIcon,
} from '@components/icons';
import { EmptyMenuContent } from '@components/ui/menu';
import { Separator } from '@components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@components/ui/toggle-group';
import { useCharacterEditor } from '@context/character-editor';
import { useState } from 'react';

export const CharacterEditorMenus = () => {
    const { flags } = useCharacterEditor();
    const [menu, setMenu] = useState<null | 'attribute' | 'item' | 'weapon' | 'spell' | 'statusEffect' | string>(null);

    return (
        <div className={'flex flex-col gap-4'}>
            <ToggleGroup
                type={'single'}
                onValueChange={(value) => {
                    if (value === menu) {
                        setMenu(null);
                    } else if (value !== menu) {
                        setMenu(value);
                    }
                }}
            >
                {[
                    {
                        value: 'attribute',
                        icon: AttributesIcon,
                        disabled: flags.exclude?.attributes,
                        hide: flags.exclude?.attributes,
                    },
                    {
                        value: 'spell',
                        icon: SpellBookIcon,
                        disabled: flags.exclude?.spellBook,
                        hide: flags.exclude?.spellBook,
                    },
                    {
                        value: 'misc',
                        icon: MiscIcon,
                        disabled: flags.exclude?.misc,
                        hide: flags.exclude?.misc,
                    },
                    {
                        value: 'item',
                        icon: InventoryIcon,
                        disabled: flags.exclude?.inventory,
                        hide: flags.exclude?.inventory,
                    },
                    {
                        value: 'weapon',
                        icon: WeaponryIcon,
                        disabled: flags.exclude?.weaponry,
                        hide: flags.exclude?.weaponry,
                    },
                    {
                        value: 'statusEffect',
                        icon: StatusEffectsIcon,
                        disabled: flags.exclude?.statusEffects,
                        hide: flags.exclude?.statusEffects,
                    },
                ]
                    .map(({ value, icon, disabled }) => (
                        <ToggleGroupItem key={value} value={value} disabled={disabled ?? false}>
                            {icon({ className: 'size-8' })}
                        </ToggleGroupItem>
                    ))
                    .sort((a, b) => {
                        if (a.props.disabled) {
                            return 1;
                        } else if (b.props.disabled) {
                            return -1;
                        }
                        return 0;
                    })}
            </ToggleGroup>
            <Separator />
            <div>
                {(() => {
                    switch (menu) {
                        case 'attribute':
                            return <AttributesEditor />;
                        case 'misc':
                            return <CharacterMiscEditor />;
                        case 'item':
                        case 'weapon':
                        case 'spell':
                        case 'statusEffect':
                            return <ComponentContainerEditor type={menu} />;
                        default:
                            return <EmptyMenuContent />;
                    }
                })()}
            </div>
        </div>
    );
};
