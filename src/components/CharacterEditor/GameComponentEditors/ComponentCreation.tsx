import {
    ItemEditor,
    SpellEditor,
    StatusEffectEditor,
    WeaponEditor,
} from '@components/CharacterEditor/GameComponentEditors/ComponentEditor';
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
import { useDataContext } from '@context/GameDataProvider';
import {
    CharacterDataEditable,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@models/CombatEditorModels';
import { isDescriptor } from '@utils';
import { SUPPORTED_DLCs } from 'config';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePlus } from 'react-icons/ai';

export const AddNewComponent = (props: { type: CONTAINER_TYPE }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    });
    const { character, updateCharacter } = useCharacterEditorContext();

    const dataContext = useDataContext();

    const [dlc, setDlc] = useState('');
    const [descriptor, setDescriptor] = useState('');
    const [component, setComponent] = useState<COMPONENT_TO_INTERFACE[CONTAINER_TYPE] | null>(null);

    useEffect(() => {
        setDlc('');
        setDescriptor('');
        setComponent(null);
    }, [props.type]);

    const getComponentFromLoadedData = useCallback(
        (dlc: string, descriptor: string) => {
            switch (props.type) {
                case 'item':
                    return dataContext?.items?.[dlc]?.[descriptor] ?? null;
                case 'weapon':
                    return dataContext?.weapons?.[dlc]?.[descriptor] ?? null;
                case 'spell':
                    return dataContext?.spells?.[dlc]?.[descriptor] ?? null;
                case 'statusEffect':
                    return dataContext?.statusEffects?.[dlc]?.[descriptor] ?? null;
                default:
                    return null;
            }
        },
        [dataContext, props],
    );

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

    useEffect(() => {
        if (!dlc) {
            return;
        }
        switch (props.type) {
            case 'item':
                if (dataContext?.items === null || dataContext?.items[dlc] === undefined) {
                    dataContext.fetchAndSetItems(dlc).catch(console.error);
                }
                break;
            case 'weapon':
                if (dataContext?.weapons === null || dataContext?.weapons[dlc] === undefined) {
                    dataContext.fetchAndSetWeapons(dlc).catch(console.error);
                }
                break;
            case 'spell':
                if (dataContext?.spells === null || dataContext?.spells[dlc] === undefined) {
                    dataContext.fetchAndSetSpells(dlc).catch(console.error);
                }
                break;
            case 'statusEffect':
                if (dataContext?.statusEffects === null || dataContext?.statusEffects[dlc] === undefined) {
                    dataContext.fetchAndSetStatusEffects(dlc).catch(console.error);
                }
                break;
        }
    }, [dlc, dataContext]);

    useEffect(() => {
        if (!dlc || !descriptor) {
            setComponent(null);
            return;
        }
        const component = getComponentFromLoadedData(dlc, descriptor);
        if (component) {
            setComponent(component);
        } else {
            setComponent(null);
        }
    }, [dlc, descriptor]);

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
                        <Combobox
                            items={(() => {
                                if (!dlc) {
                                    return [];
                                }
                                switch (props.type) {
                                    case 'item':
                                        return Object.keys(dataContext?.items?.[dlc] ?? {});
                                    case 'weapon':
                                        return Object.keys(dataContext?.weapons?.[dlc] ?? {});
                                    case 'spell':
                                        return Object.keys(dataContext?.spells?.[dlc] ?? {});
                                    case 'statusEffect':
                                        return Object.keys(dataContext?.statusEffects?.[dlc] ?? {});
                                    default:
                                        return [];
                                }
                            })().map((descriptor) => ({
                                value: descriptor,
                                label: descriptor,
                            }))}
                            value={descriptor}
                            onChange={(e) => {
                                setDescriptor(e);
                            }}
                        />
                    </div>
                </div>
            </div>
            {component &&
                (() => {
                    switch (props.type) {
                        case 'item':
                            return <ItemEditor component={component as ItemEditable} setComponent={setComponent} />;
                        case 'weapon':
                            return <WeaponEditor component={component as WeaponEditable} setComponent={setComponent} />;
                        case 'spell':
                            return <SpellEditor component={component as SpellEditable} setComponent={setComponent} />;
                        case 'statusEffect':
                            return (
                                <StatusEffectEditor
                                    component={component as StatusEffectEditable}
                                    setComponent={setComponent}
                                />
                            );
                        default:
                            return null;
                    }
                })()}
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

export interface COMPONENT_TO_INTERFACE {
    item: ItemEditable;
    weapon: WeaponEditable;
    spell: SpellEditable;
    statusEffect: StatusEffectEditable;
}

export type CONTAINER_TYPE = 'item' | 'weapon' | 'spell' | 'statusEffect';
