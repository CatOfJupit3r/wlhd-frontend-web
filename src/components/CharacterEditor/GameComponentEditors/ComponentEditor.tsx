import {
    ActivenessEditor,
    AllowedEditables,
    CooldownEditor,
    CostEditor,
    CreateNewMemoryWithAccordion,
    DurationEditor,
    MemoriesEditor,
    QuantityEditor,
    TagsEditor,
    UsesEditor,
} from '@components/CharacterEditor/GameComponentEditors/ComponentSegmentEditors';
import DescriptionWithMemories from '@components/InfoDisplay/DescriptionWithMemories';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import useDualTranslation from '@hooks/useDualTranslation';
import { ItemEditable, SpellEditable, StatusEffectEditable, WeaponEditable } from '@models/CombatEditorModels';
import React, { useCallback } from 'react';
import { FaTags } from 'react-icons/fa';

type ComponentEditorProps<T extends AllowedEditables> = {
    component: T;
    setComponent: (component: T) => void;
    canBeActivated?: (component?: T) => boolean;
};

const ComponentEditorFactory = <T extends AllowedEditables>(type: string): React.FC<ComponentEditorProps<T>> => {
    const Created: React.FC<ComponentEditorProps<T>> = ({ component, setComponent, canBeActivated }) => {
        const { t } = useDualTranslation('local', { keyPrefix: 'editor' });

        const changeComponentField = useCallback(
            (key: string, value: AllowedEditables[keyof AllowedEditables]) => {
                setComponent({
                    ...component,
                    [key]: value,
                });
            },
            [component, setComponent],
        );

        return (
            <div
                className={
                    'border-container-medium relative flex w-full max-w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-3'
                }
            >
                <Accordion type={'single'} collapsible={true} defaultValue={'main-info'}>
                    <AccordionItem value={'main-info'}>
                        <AccordionTrigger>
                            <div
                                id={'main-info'}
                                className={'flex w-full flex-row justify-between overflow-hidden text-xl font-bold'}
                            >
                                <div className={'flex flex-row items-center gap-2'}>
                                    {t(component.decorations?.name, { includePrefix: false }) ?? '???'}
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            {type === 'weapon' || type === 'spell' ? (
                                <div className={'flex flex-row items-center gap-2'}>
                                    <Label className={'flex flex-row gap-1'}>{t('shared.is-active')}</Label>
                                    <ActivenessEditor
                                        component={component}
                                        changeComponentField={changeComponentField}
                                        disabled={canBeActivated ? !canBeActivated(component) : true}
                                    />
                                </div>
                            ) : null}
                            <Separator />
                            <div id={'minor-info'} className={'flex flex-row justify-between text-base'}>
                                <div className={'flex flex-col gap-3'}>
                                    {type === 'item' || type === 'weapon' ? (
                                        <QuantityEditor
                                            component={component}
                                            changeComponentField={changeComponentField}
                                        />
                                    ) : null}
                                    {type === 'item' || type === 'weapon' || type === 'spell' ? (
                                        <UsesEditor component={component} changeComponentField={changeComponentField} />
                                    ) : null}
                                </div>
                                <div id={'type-details'} className={'flex flex-col gap-3'}>
                                    {type === 'statusEffect' ? (
                                        <DurationEditor
                                            component={component}
                                            changeComponentField={changeComponentField}
                                        />
                                    ) : (
                                        <>
                                            <CooldownEditor
                                                component={component}
                                                changeComponentField={changeComponentField}
                                            />
                                            <CostEditor
                                                component={component}
                                                changeComponentField={changeComponentField}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <Separator />
                            <DescriptionWithMemories
                                memory={component.memory}
                                description={component.decorations?.description}
                                className={'break-words text-sm italic text-gray-400'}
                            />
                            <Separator />
                            <div className={'flex flex-col gap-3'}>
                                <Label className={'flex flex-row gap-1'}>
                                    <FaTags className={'inline-block'} />
                                    {t('tags.title')}
                                </Label>
                                <TagsEditor component={component} changeComponentField={changeComponentField} />
                            </div>
                            <Separator />
                            <div className={'flex flex-col gap-2'}>
                                <CreateNewMemoryWithAccordion
                                    component={component}
                                    changeComponentField={changeComponentField}
                                />
                                <MemoriesEditor component={component} changeComponentField={changeComponentField} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    };
    Created.displayName = `${type}Editor`;
    return Created;
};

const ItemEditor = ComponentEditorFactory<ItemEditable>('item');

const WeaponEditor = ComponentEditorFactory<WeaponEditable>('weapon');

const SpellEditor = ComponentEditorFactory<SpellEditable>('spell');

const StatusEffectEditor = ComponentEditorFactory<StatusEffectEditable>('statusEffect');

export { ItemEditor, WeaponEditor, SpellEditor, StatusEffectEditor };
export type { ComponentEditorProps };
