import { ItemEditor, SpellEditor, StatusEffectEditor, WeaponEditor } from '@components/editors/game-component-editors';
import {
    AddNewComponent,
    COMPONENT_TO_INTERFACE,
    CONTAINER_TYPE,
} from '@components/editors/game-component-editors/add-new-component';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { EmptyMenuContent } from '@components/ui/menu';
import { useCharacterEditor } from '@context/character-editor';
import { ItemEditable, SpellEditable, StatusEffectEditable, WeaponEditable } from '@models/CombatEditorModels';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTrashAlt } from 'react-icons/fa';

const RemoveComponentButton = ({ index, type }: { index: number; type: CONTAINER_TYPE }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    });
    const { removeFromInventory, removeFromWeaponry, removeFromSpellBook, removeFromStatusEffect } =
        useCharacterEditor();

    const removeComponent = useCallback(
        (index: number) => {
            switch (type) {
                case 'item':
                    removeFromInventory(index);
                    break;
                case 'weapon':
                    removeFromWeaponry(index);
                    break;
                case 'spell':
                    removeFromSpellBook(index);
                    break;
                case 'statusEffect':
                    removeFromStatusEffect(index);
                    break;
            }
        },
        [removeFromInventory, removeFromWeaponry, removeFromSpellBook, removeFromStatusEffect, type],
    );

    return (
        <Button
            variant={'destructive'}
            onClick={() => {
                removeComponent(index);
            }}
        >
            <FaTrashAlt className={'mr-1 text-2xl'} />
            {t('general.remove')}
        </Button>
    );
};

const ContainerContent = (props: { type: CONTAINER_TYPE }) => {
    const {
        character,
        updateItemInInventory,
        updateSpellInSpellBook,
        updateWeaponInWeaponry,
        updateStatusEffectInStatusEffects,
        updateSpellBookMaxActiveSpells,
    } = useCharacterEditor();
    const { type } = props;
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    });

    const updateComponent = useCallback(
        (index: number) => {
            return (component: COMPONENT_TO_INTERFACE[CONTAINER_TYPE]) => {
                switch (type) {
                    case 'item':
                        updateItemInInventory({ index, component });
                        break;
                    case 'weapon':
                        updateWeaponInWeaponry({ index, component });
                        break;
                    case 'spell':
                        updateSpellInSpellBook({ index, component });
                        break;
                    case 'statusEffect':
                        updateStatusEffectInStatusEffects({ index, component });
                        break;
                }
            };
        },
        [
            props.type,
            updateItemInInventory,
            updateSpellInSpellBook,
            updateWeaponInWeaponry,
            updateStatusEffectInStatusEffects,
        ],
    );

    switch (type) {
        case 'item':
            if (character.inventory.length === 0) {
                return <EmptyMenuContent />;
            } else {
                return (
                    <>
                        {character.inventory.map((item, index) => {
                            return (
                                <div key={index} className={'flex flex-col gap-2'}>
                                    <RemoveComponentButton index={index} type={'item'} />
                                    <ItemEditor
                                        component={item as ItemEditable}
                                        setComponent={updateComponent(index)}
                                    />
                                </div>
                            );
                        })}
                    </>
                );
            }
        case 'weapon':
            if (character.weaponry.length === 0) {
                return <EmptyMenuContent />;
            } else {
                return (
                    <>
                        {character.weaponry.map((weapon, index) => {
                            return (
                                <div key={index} className={'flex flex-col gap-2'}>
                                    <RemoveComponentButton index={index} type={'weapon'} />
                                    <WeaponEditor
                                        component={weapon as WeaponEditable}
                                        setComponent={updateComponent(index)}
                                        canBeActivated={() => {
                                            return (
                                                character.weaponry.filter((weapon) => weapon.isActive).length + 1 < 2
                                            );
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </>
                );
            }
        case 'spell':
            return (
                <div id={'max-active-spells-editor'} className={'flex flex-col gap-2'}>
                    <div>
                        <p>
                            {t('spell.max-spells', {
                                maxSpells: '256',
                            })}
                        </p>
                        <Input
                            type={'string'}
                            placeholder={t('general.infinity')}
                            value={character.spellBook.maxActiveSpells || ''}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    updateSpellBookMaxActiveSpells(null);
                                    return;
                                }
                                const value = parseInt(e.target.value);

                                if (isNaN(value) || value < 0 || value > 256) {
                                    return;
                                } else {
                                    updateSpellBookMaxActiveSpells(value);
                                }
                            }}
                        />
                    </div>
                    {character.spellBook.knownSpells.length === 0 ? (
                        <EmptyMenuContent />
                    ) : (
                        character.spellBook.knownSpells.map((spell, index) => {
                            return (
                                <div key={index} className={'flex flex-col gap-2'}>
                                    <RemoveComponentButton index={index} type={'spell'} />
                                    <SpellEditor
                                        component={spell as SpellEditable}
                                        setComponent={updateComponent(index)}
                                        canBeActivated={() => {
                                            return character.spellBook.maxActiveSpells
                                                ? character.spellBook.knownSpells.filter((spell) => spell.isActive)
                                                      .length +
                                                      1 <
                                                      character.spellBook.maxActiveSpells
                                                : true;
                                        }}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            );
        case 'statusEffect':
            if (character.statusEffects.length === 0) {
                return <EmptyMenuContent />;
            } else {
                return (
                    <>
                        {character.statusEffects.map((effect, index) => {
                            return (
                                <div key={index} className={'flex flex-col gap-2'}>
                                    <RemoveComponentButton index={index} type={'statusEffect'} />
                                    <StatusEffectEditor
                                        component={effect as StatusEffectEditable}
                                        setComponent={updateComponent(index)}
                                    />
                                </div>
                            );
                        })}
                    </>
                );
            }
        default:
            return <EmptyMenuContent />;
    }
};

const ComponentContainerEditor = ({ type }: { type: CONTAINER_TYPE }) => {
    // maybe extract this to general editor folder too
    // but for now, it's only needed in character editor, so it's fine
    const { addItemToInventory, addSpellToSpellBook, addWeaponToWeaponry, addStatusEffectToContainers } =
        useCharacterEditor();
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    });

    const addNewComponent = useCallback(
        (component: COMPONENT_TO_INTERFACE[CONTAINER_TYPE], descriptor: string) => {
            switch (type) {
                case 'item':
                    addItemToInventory({
                        ...component,
                        descriptor,
                    });
                    break;
                case 'weapon':
                    addWeaponToWeaponry({
                        ...component,
                        descriptor,
                    });
                    break;
                case 'spell':
                    addSpellToSpellBook({
                        ...component,
                        descriptor,
                    });
                    break;
                case 'statusEffect':
                    addStatusEffectToContainers({
                        ...component,
                        descriptor,
                    });
                    break;
            }
        },
        [addItemToInventory, addSpellToSpellBook, addWeaponToWeaponry, addStatusEffectToContainers],
    );

    return (
        <div id={'component-container'} className={'flex flex-col gap-4'}>
            <Accordion type={'single'} collapsible>
                <AccordionItem value={'add-new-component'}>
                    <AccordionTrigger className={'text-xl'}>{t(`${type}.add`)}</AccordionTrigger>
                    <AccordionContent>
                        <AddNewComponent type={type} onAdd={addNewComponent} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <ContainerContent type={type} />
        </div>
    );
};

export default ComponentContainerEditor;
