import {
    AreaEffectEditable,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@type-defs/combat-editor-models';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePlus } from 'react-icons/ai';

import { DLCSelect, GameComponentDescriptorCombobox } from '@components/common/descriptor-components';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import {
    useGameAreaEffectInformation,
    useGameItemInformation,
    useGameSpellInformation,
    useGameStatusEffectInformation,
    useGameWeaponInformation,
} from '@queries/game-data/use-game-data';
import {
    useLoadedAreaEffects,
    useLoadedItems,
    useLoadedSpells,
    useLoadedStatusEffects,
    useLoadedWeapons,
} from '@queries/game-data/use-loaded-game-data';
import { cn, isDescriptor } from '@utils';

import { AreaEffectEditor, ItemEditor, SpellEditor, StatusEffectEditor, WeaponEditor } from './predeclared-editors';

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
    areaEffect: AreaEffectEditable;
}

export type CONTAINER_TYPE = 'item' | 'weapon' | 'spell' | 'statusEffect' | 'areaEffect';

const ItemCombobox: FC<iComponentCombobox> = ({ dlc, descriptor, onChange }) => {
    const { items } = useLoadedItems(dlc);

    return <GameComponentDescriptorCombobox items={items ?? {}} value={descriptor} onChangeValue={onChange} />;
};

const WeaponCombobox: FC<iComponentCombobox> = ({ dlc, descriptor, onChange }) => {
    const { weapons } = useLoadedWeapons(dlc);

    return <GameComponentDescriptorCombobox items={weapons ?? {}} value={descriptor} onChangeValue={onChange} />;
};

const SpellCombobox: FC<iComponentCombobox> = ({ dlc, descriptor, onChange }) => {
    const { spells } = useLoadedSpells(dlc);

    return <GameComponentDescriptorCombobox items={spells ?? {}} value={descriptor} onChangeValue={onChange} />;
};

const StatusEffectCombobox: FC<iComponentCombobox> = ({ dlc, descriptor, onChange }) => {
    const { statusEffects } = useLoadedStatusEffects(dlc);

    return <GameComponentDescriptorCombobox items={statusEffects ?? {}} value={descriptor} onChangeValue={onChange} />;
};

const AreaEffectCombobox: FC<iComponentCombobox> = ({ dlc, descriptor, onChange }) => {
    const { areaEffects } = useLoadedAreaEffects(dlc);

    return <GameComponentDescriptorCombobox items={areaEffects ?? {}} value={descriptor} onChangeValue={onChange} />;
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

const AreaEffectPreview: FC<iComponentPreview<'areaEffect'>> = ({ setComponent, component, dlc, descriptor }) => {
    const { areaEffect, isPending } = useGameAreaEffectInformation(dlc, descriptor);

    useEffect(() => {
        if (!dlc || !descriptor || isPending || !areaEffect) return;
        setComponent(areaEffect);
    }, [dlc, descriptor, isPending, areaEffect]);

    if (isPending || !areaEffect || !component) return null;
    return <AreaEffectEditor component={component} setComponent={setComponent} />;
};

interface iAddNewComponentProps<T extends CONTAINER_TYPE = CONTAINER_TYPE> {
    type: T;
    onAdd: (component: COMPONENT_TO_INTERFACE[T], descriptor: string) => void;
    className?: string;
}

export const AddNewComponent: FC<iAddNewComponentProps> = ({ type, onAdd, className }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    });
    const [dlc, setDlc] = useState('');
    const [descriptor, setDescriptor] = useState('');
    const [component, setComponent] = useState<COMPONENT_TO_INTERFACE[CONTAINER_TYPE] | null>(null);

    return (
        <div id={`add-new-component`} className={cn('w-full', className)}>
            <div className={'w-full gap-3'}>
                <div className={'flex w-full flex-row gap-2'}>
                    <div className={'w-full'}>
                        <Label>{t('general.dlc')}</Label>
                        <DLCSelect
                            value={dlc}
                            selectTriggerClassName={'w-full'}
                            onChangeValue={(value) => {
                                setDescriptor('');
                                setComponent(null);
                                setDlc(value);
                            }}
                            placeholder={t('general.select-dlc')}
                            selectLabel={t('general.dlc')}
                        />
                    </div>
                    <div className={'w-full'}>
                        <Label>{t('general.descriptor')}</Label>
                        {type === 'item' ? (
                            <ItemCombobox dlc={dlc} descriptor={descriptor} onChange={setDescriptor} />
                        ) : type === 'weapon' ? (
                            <WeaponCombobox dlc={dlc} descriptor={descriptor} onChange={setDescriptor} />
                        ) : type === 'spell' ? (
                            <SpellCombobox dlc={dlc} descriptor={descriptor} onChange={setDescriptor} />
                        ) : type === 'statusEffect' ? (
                            <StatusEffectCombobox dlc={dlc} descriptor={descriptor} onChange={setDescriptor} />
                        ) : type === 'areaEffect' ? (
                            <AreaEffectCombobox dlc={dlc} descriptor={descriptor} onChange={setDescriptor} />
                        ) : null}
                    </div>
                </div>
            </div>
            {dlc && descriptor ? (
                type === 'item' ? (
                    <ItemPreview
                        dlc={dlc}
                        descriptor={descriptor}
                        component={component as ItemEditable}
                        setComponent={setComponent}
                    />
                ) : type === 'weapon' ? (
                    <WeaponPreview
                        dlc={dlc}
                        descriptor={descriptor}
                        component={component as WeaponEditable}
                        setComponent={setComponent}
                    />
                ) : type === 'spell' ? (
                    <SpellPreview
                        dlc={dlc}
                        descriptor={descriptor}
                        component={component as SpellEditable}
                        setComponent={setComponent}
                    />
                ) : type === 'statusEffect' ? (
                    <StatusEffectPreview
                        dlc={dlc}
                        descriptor={descriptor}
                        component={component as StatusEffectEditable}
                        setComponent={setComponent}
                    />
                ) : type === 'areaEffect' ? (
                    <AreaEffectPreview
                        dlc={dlc}
                        descriptor={descriptor}
                        component={component as AreaEffectEditable}
                        setComponent={setComponent}
                    />
                ) : null
            ) : null}
            <Button
                onClick={() => {
                    if (component && dlc && descriptor) {
                        onAdd(component, `${dlc}:${descriptor}`);
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
