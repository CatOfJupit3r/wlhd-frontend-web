import {
    AddNewComponent,
    COMPONENT_TO_INTERFACE,
    CONTAINER_TYPE,
} from '@components/CharacterEditor/GameComponentEditors/ComponentCreation'
import {
    ItemEditor,
    SpellEditor,
    StatusEffectEditor,
    WeaponEditor,
} from '@components/CharacterEditor/GameComponentEditors/ComponentEditor'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { EmptyMenuContent } from '@components/ui/menu'
import { useCharacterEditorContext } from '@context/CharacterEditorProvider'
import {
    CharacterDataEditable,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@models/CombatEditorModels'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const ContainerContent = (props: { type: CONTAINER_TYPE }) => {
    const { character, updateCharacter } = useCharacterEditorContext()
    const { type } = props
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })

    const updateComponent = useCallback(
        (index: number) => {
            return (component: COMPONENT_TO_INTERFACE[CONTAINER_TYPE]) => {
                const newCharacter = { ...character }
                switch (type) {
                    case 'item':
                        newCharacter.inventory[index] = component as CharacterDataEditable['inventory'][number]
                        break
                    case 'weapon':
                        newCharacter.weaponry[index] = component as CharacterDataEditable['weaponry'][number]
                        break
                    case 'spell':
                        newCharacter.spellBook.knownSpells[index] =
                            component as CharacterDataEditable['spellBook']['knownSpells'][number]
                        break
                    case 'statusEffect':
                        newCharacter.statusEffects[index] = component as CharacterDataEditable['statusEffects'][number]
                        break
                }
                updateCharacter(newCharacter)
            }
        },
        [props.type, character, updateCharacter]
    )

    switch (type) {
        case 'item':
            if (character.inventory.length === 0) {
                return <EmptyMenuContent />
            } else {
                return (
                    <>
                        {character.inventory.map((item, index) => {
                            return (
                                <div key={index}>
                                    <ItemEditor
                                        component={item as ItemEditable}
                                        setComponent={updateComponent(index)}
                                    />
                                </div>
                            )
                        })}
                    </>
                )
            }
        case 'weapon':
            if (character.weaponry.length === 0) {
                return <EmptyMenuContent />
            } else {
                return (
                    <>
                        {character.weaponry.map((weapon, index) => {
                            return (
                                <div key={index}>
                                    <WeaponEditor
                                        component={weapon as WeaponEditable}
                                        setComponent={updateComponent(index)}
                                        canBeActivated={() => {
                                            return character.weaponry.filter((weapon) => weapon.isActive).length + 1 < 2
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </>
                )
            }
        case 'spell':
            return (
                <div id={'max-active-spells-editor'}>
                    <div>
                        <Label>
                            {t('spell.max-spells', {
                                maxSpells: '256',
                            })}
                        </Label>
                        <Input
                            type={'string'}
                            placeholder={t('general.infinity')}
                            value={character.spellBook.maxActiveSpells || ''}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    updateCharacter({
                                        ...character,
                                        spellBook: {
                                            ...character.spellBook,
                                            maxActiveSpells: null,
                                        },
                                    })
                                    return
                                }
                                const value = parseInt(e.target.value)

                                if (isNaN(value) || value < 0 || value > 256) {
                                    return
                                } else {
                                    updateCharacter({
                                        ...character,
                                        spellBook: {
                                            knownSpells: character.spellBook.knownSpells.map((spell) => ({
                                                ...spell,
                                                isActive: false,
                                            })),
                                            maxActiveSpells: value,
                                        },
                                    })
                                }
                            }}
                        />
                    </div>
                    {character.spellBook.knownSpells.length === 0 ? (
                        <EmptyMenuContent />
                    ) : (
                        character.spellBook.knownSpells.map((spell, index) => {
                            return (
                                <div key={index}>
                                    <SpellEditor
                                        component={spell as SpellEditable}
                                        setComponent={updateComponent(index)}
                                        canBeActivated={() => {
                                            return character.spellBook.maxActiveSpells
                                                ? character.spellBook.knownSpells.filter((spell) => spell.isActive)
                                                      .length +
                                                      1 <
                                                      character.spellBook.maxActiveSpells
                                                : true
                                        }}
                                    />
                                </div>
                            )
                        })
                    )}
                </div>
            )
        case 'statusEffect':
            if (character.statusEffects.length === 0) {
                return <EmptyMenuContent />
            } else {
                return (
                    <>
                        {character.statusEffects.map((effect, index) => {
                            return (
                                <div key={index}>
                                    <StatusEffectEditor
                                        component={effect as StatusEffectEditable}
                                        setComponent={updateComponent(index)}
                                    />
                                </div>
                            )
                        })}
                    </>
                )
            }
        default:
            return <EmptyMenuContent />
    }
}

const ComponentContainerEditor = ({ type }: { type: CONTAINER_TYPE }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })

    return (
        <div id={'component-container'} className={'flex flex-col gap-4'}>
            <Accordion type={'single'} collapsible>
                <AccordionItem value={'add-new-component'}>
                    <AccordionTrigger className={'text-xl'}>{t(`${type}.add`)}</AccordionTrigger>
                    <AccordionContent>
                        <AddNewComponent type={type} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <ContainerContent type={type} />
        </div>
    )
}

export default ComponentContainerEditor
