import {
    ItemEditor,
    SpellEditor,
    StatusEffectEditor,
    WeaponEditor,
} from '@components/CharacterEditor/GameComponentEditors/ComponentEditor';
import { gameAssetToComboboxIcon } from '@components/GameAsset';
import { Button } from '@components/ui/button';
import { Combobox } from '@components/ui/combobox';
import { Label } from '@components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select';
import { useCharacterEditorContext } from '@context/CharacterEditorProvider';
import {
    CharacterDataEditable,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@models/CombatEditorModels';
import {
    useGameItemInformation,
    useGameSpellInformation,
    useGameStatusEffectInformation,
    useGameWeaponInformation,
} from '@queries/useGameData';
import { useLoadedItems, useLoadedSpells, useLoadedStatusEffects, useLoadedWeapons } from '@queries/useLoadedGameData';
import { isDescriptor } from '@utils';
import { SUPPORTED_DLCs } from 'config';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePlus } from 'react-icons/ai';

interface iComponentCombobox {
    dlc: string;
    descriptor: string;
    onChange: (descriptor: string) => void;
}

interface iComponentPreview<T extends CONTAINER_TYPE> {
    setComponent: (component: COMPONENT_TO_INTERFACE[T]) => void;
    component: COMPONENT_TO_INTERFACE[T] | null;
    dlc: string;
    descriptor: string;
}

export interface COMPONENT_TO_INTERFACE {
    item: ItemEditable;
    weapon: WeaponEditable;
    spell: SpellEditable;
    statusEffect: StatusEffectEditable;
}

export type CONTAINER_TYPE = 'item' | 'weapon' | 'spell' | 'statusEffect';

const ItemCombobox: FC<iComponentCombobox> = ({ dlc, descriptor, onChange }) => {
    const { items } = useLoadedItems(dlc);
    const { t } = useTranslation();

    return (
        <Combobox
            items={Object.entries(items ?? {}).map(([descriptor, item]) => ({
                value: descriptor,
                label: t(item.decorations.name),
                icon: gameAssetToComboboxIcon(item),
            }))}
            includeSearch={true}
            value={descriptor}
            onChange={(e) => {
                onChange(e);
            }}
        />
    );
};

const WeaponCombobox: FC<iComponentCombobox> = ({ dlc, descriptor, onChange }) => {
    const { weapons } = useLoadedWeapons(dlc);
    const { t } = useTranslation();

    return (
        <Combobox
            items={Object.entries(weapons ?? {}).map(([descriptor, weapon]) => ({
                value: descriptor,
                label: t(weapon.decorations.name),
                icon: gameAssetToComboboxIcon(weapon),
            }))}
            includeSearch={true}
            value={descriptor}
            onChange={(e) => {
                onChange(e);
            }}
        />
    );
};

const SpellCombobox: FC<iComponentCombobox> = ({ dlc, descriptor, onChange }) => {
    const { spells } = useLoadedSpells(dlc);
    const { t } = useTranslation();

    return (
        <Combobox
            items={Object.entries(spells ?? {}).map(([descriptor, spell]) => ({
                value: descriptor,
                label: t(spell.decorations.name),
                icon: gameAssetToComboboxIcon(spell),
            }))}
            includeSearch={true}
            value={descriptor}
            onChange={(e) => {
                onChange(e);
            }}
        />
    );
};

const StatusEffectCombobox: FC<iComponentCombobox> = ({ dlc, descriptor, onChange }) => {
    const { statusEffects } = useLoadedStatusEffects(dlc);
    const { t } = useTranslation();

    return (
        <Combobox
            items={Object.entries(statusEffects ?? {}).map(([descriptor, statusEffect]) => ({
                value: descriptor,
                label: t(statusEffect.decorations.name),
                icon: gameAssetToComboboxIcon(statusEffect),
            }))}
            includeSearch={true}
            value={descriptor}
            onChange={(e) => {
                onChange(e);
            }}
        />
    );
};

const ItemPreview: FC<iComponentPreview<'item'>> = ({ setComponent, component, dlc, descriptor }) => {
    const { item, isPending } = useGameItemInformation(dlc, descriptor);

    useEffect(() => {
        if (!dlc || !descriptor || isPending || !item) return;
        setComponent(item);
    }, [dlc, descriptor, isPending, item]);

    if (isPending || !item || !component) return null;
    return <ItemEditor component={component} setComponent={setComponent} />;
};

const WeaponPreview: FC<iComponentPreview<'weapon'>> = ({ setComponent, component, dlc, descriptor }) => {
    const { weapon, isPending } = useGameWeaponInformation(dlc, descriptor);

    useEffect(() => {
        if (!dlc || !descriptor || isPending || !weapon) return;
        setComponent(weapon);
    }, [dlc, descriptor, isPending, weapon]);

    if (isPending || !weapon || !component) return null;
    return <WeaponEditor component={component} setComponent={setComponent} />;
};

const SpellPreview: FC<iComponentPreview<'spell'>> = ({ setComponent, component, dlc, descriptor }) => {
    const { spell, isPending } = useGameSpellInformation(dlc, descriptor);

    useEffect(() => {
        if (!dlc || !descriptor || isPending || !spell) return;
        setComponent(spell);
    }, [dlc, descriptor, isPending, spell]);

    if (isPending || !spell || !component) return null;
    return <SpellEditor component={component} setComponent={setComponent} />;
};

const StatusEffectPreview: FC<iComponentPreview<'statusEffect'>> = ({ setComponent, component, dlc, descriptor }) => {
    const { statusEffect, isPending } = useGameStatusEffectInformation(dlc, descriptor);

    useEffect(() => {
        if (!dlc || !descriptor || isPending || !statusEffect) return;
        setComponent(statusEffect);
    }, [dlc, descriptor, isPending, statusEffect]);

    if (isPending || !statusEffect || !component) return null;
    return <StatusEffectEditor component={component} setComponent={setComponent} />;
};

export const AddNewComponent = (props: { type: CONTAINER_TYPE }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    });
    const { character, updateCharacter } = useCharacterEditorContext();
    const [dlc, setDlc] = useState('');
    const [descriptor, setDescriptor] = useState('');
    const [component, setComponent] = useState<COMPONENT_TO_INTERFACE[CONTAINER_TYPE] | null>(null);

    const addNewComponent = useCallback(
        (component: COMPONENT_TO_INTERFACE[CONTAINER_TYPE]) => {
            const newCharacter = { ...character };
            switch (props.type) {
                case 'item':
                    newCharacter.inventory = [
                        ...newCharacter.inventory,
                        {
                            ...component,
                            descriptor: `${dlc}:${descriptor}`,
                        } as CharacterDataEditable['inventory'][number],
                    ];
                    break;
                case 'weapon':
                    newCharacter.weaponry = [
                        ...newCharacter.weaponry,
                        component as CharacterDataEditable['weaponry'][number],
                    ];
                    break;
                case 'spell':
                    newCharacter.spellBook = {
                        ...newCharacter.spellBook,
                        knownSpells: [
                            ...newCharacter.spellBook.knownSpells,
                            component as CharacterDataEditable['spellBook']['knownSpells'][number],
                        ],
                    };
                    break;
                case 'statusEffect':
                    newCharacter.statusEffects = [
                        ...newCharacter.statusEffects,
                        component as CharacterDataEditable['statusEffects'][number],
                    ];
                    break;
            }
            updateCharacter(newCharacter);
        },
        [character, props, component, descriptor, dlc, updateCharacter],
    );

    return (
        <div id={`add-new-component`}>
            <div>
                <div className={'flex flex-col gap-2'}>
                    <div>
                        <Label>{t('general.dlc')}</Label>
                        <Select
                            onValueChange={(value) => {
                                setDescriptor('');
                                setComponent(null);
                                setDlc(value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('general.select-dlc')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t('general.dlc')}</SelectLabel>
                                    {SUPPORTED_DLCs.map(({ title, descriptor }) => (
                                        <SelectItem key={descriptor} value={descriptor}>
                                            {title}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>{t('general.descriptor')}</Label>
                        {props.type === 'item' ? (
                            <ItemCombobox dlc={dlc} descriptor={descriptor} onChange={setDescriptor} />
                        ) : props.type === 'weapon' ? (
                            <WeaponCombobox dlc={dlc} descriptor={descriptor} onChange={setDescriptor} />
                        ) : props.type === 'spell' ? (
                            <SpellCombobox dlc={dlc} descriptor={descriptor} onChange={setDescriptor} />
                        ) : props.type === 'statusEffect' ? (
                            <StatusEffectCombobox dlc={dlc} descriptor={descriptor} onChange={setDescriptor} />
                        ) : null}
                    </div>
                </div>
            </div>
            {dlc && descriptor ? (
                props.type === 'item' ? (
                    <ItemPreview
                        dlc={dlc}
                        descriptor={descriptor}
                        component={component as ItemEditable}
                        setComponent={setComponent}
                    />
                ) : props.type === 'weapon' ? (
                    <WeaponPreview
                        dlc={dlc}
                        descriptor={descriptor}
                        component={component as WeaponEditable}
                        setComponent={setComponent}
                    />
                ) : props.type === 'spell' ? (
                    <SpellPreview
                        dlc={dlc}
                        descriptor={descriptor}
                        component={component as SpellEditable}
                        setComponent={setComponent}
                    />
                ) : props.type === 'statusEffect' ? (
                    <StatusEffectPreview
                        dlc={dlc}
                        descriptor={descriptor}
                        component={component as StatusEffectEditable}
                        setComponent={setComponent}
                    />
                ) : null
            ) : null}
            <Button
                onClick={() => {
                    if (component) {
                        addNewComponent(component);
                    }
                }}
                className={'mt-2'}
                disabled={!dlc || !descriptor || !isDescriptor(`${dlc}:${descriptor}`)}
            >
                <AiOutlinePlus className={'mr-2 text-2xl text-white'} />
                {t('general.add')}
            </Button>
        </div>
    );
};
