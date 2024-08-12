import React, { useCallback, useEffect, useState } from 'react'
import { EntityInfoFull, SpellInfo } from '@models/Battlefield'
import { Label } from '@components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import { DLCs } from '@components/CharacterEditor/CharacterEditor'
import { Combobox } from '@components/ui/combobox'
import { SpellInfoDisplay } from '@components/InfoDisplay/InfoDisplay'
import { Button } from '@components/ui/button'
import { isDescriptor } from '@utils'
import { AiOutlinePlus } from 'react-icons/ai'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Checkbox } from '@components/ui/checkbox'
import { EmptyFeatureContent } from '@components/CharacterDisplay/CharacterFeatures/FeatureContainer'
import { useDataContext } from '@components/ContextProviders/GameDataProvider'
import { useCharacterEditorContext } from '@components/ContextProviders/CharacterEditorProvider'
import { Input } from '@components/ui/input'
import { getHandlerChange } from '@components/CharacterEditor/GameComponentEditors/editorUtils'
import { useTranslation } from 'react-i18next'

const checkIfCanActivateMore = (
    max: EntityInfoFull['spellBook']['maxActiveSpells'],
    spells: EntityInfoFull['spellBook']['spells']
) => {
    return max === null ? true : spells.filter((spell) => spell.isActive).length < max
}

const AddNewSpellComponent = () => {
    const { character, updateCharacter, flags } = useCharacterEditorContext()
    const { spellBook } = flags

    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })

    const [dlc, setDlc] = useState('')
    const [descriptor, setDescriptor] = useState('')

    const { spells, fetchAndSetSpells } = useDataContext()
    const [spell, setSpell] = useState<SpellInfo | null>(null)

    useEffect(() => {
        if (dlc && (spells === null || spells?.[dlc] === undefined)) {
            fetchAndSetSpells(dlc).catch(console.error)
        }
    }, [dlc, spells])

    const getSpellFromLoadedSpells = useCallback(
        (dlc: string, descriptor: string) => {
            return spells?.[dlc]?.[descriptor] ?? null
        },
        [dlc, spells]
    )

    useEffect(() => {
        const spell = getSpellFromLoadedSpells(dlc, descriptor)
        if (spell) {
            setSpell(spell)
        }
    }, [dlc, descriptor])

    const addNewSpell = useCallback(
        (spell: SpellInfo) => {
            updateCharacter({
                ...character,
                spellBook: {
                    ...character.spellBook,
                    spells: character.spellBook.spells.concat(spell),
                },
            })
        },
        [character]
    )

    return (
        <div id={'add-new-spell'}>
            <div>
                <div className={'flex flex-col gap-2'}>
                    <div>
                        <Label>{t('general.dlc')}</Label>
                        <Select
                            onValueChange={(value) => {
                                setDlc(value)
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('general.select-dlc')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t('general.dlc')}</SelectLabel>
                                    {DLCs.map(({ value, label }) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>{t('general.descriptor')}</Label>
                        <Combobox
                            items={[
                                ...Object.keys(spells?.[dlc] ?? {}).map((descriptor) => ({
                                    value: descriptor,
                                    label: descriptor,
                                })),
                            ]}
                            includeSearch={true}
                            value={descriptor}
                            onChange={(e) => {
                                setDescriptor(e)
                            }}
                        />
                    </div>
                </div>
            </div>
            {spell && (
                <div>
                    {spellBook?.allowCooldown && spell.cooldown.max !== null && spell.cooldown.max !== 0 && (
                        <div>
                            <Label>{t('general.cooldown')}</Label>
                            <Input
                                placeholder={t('general.cooldown')}
                                value={spell?.cooldown.current}
                                onChange={getHandlerChange(
                                    spell.cooldown.max,
                                    0,
                                    (value) => {
                                        setSpell({
                                            ...spell,
                                            cooldown: {
                                                ...spell.cooldown,
                                                current: value,
                                            },
                                        })
                                    },
                                    0
                                )}
                                disabled={spell.cooldown.max === 0}
                            ></Input>
                        </div>
                    )}
                    {spellBook?.allowUses && spell.uses.max !== null && spell.uses.max !== 0 && (
                        <div>
                            <Label>{t('general.uses')}</Label>
                            <Input
                                placeholder={t('general.uses')}
                                value={spell?.uses.current}
                                onChange={getHandlerChange(
                                    spell.uses.max,
                                    0,
                                    (value) => {
                                        setSpell({
                                            ...spell,
                                            uses: {
                                                ...spell.uses,
                                                current: value,
                                            },
                                        })
                                    },
                                    0
                                )}
                            ></Input>
                        </div>
                    )}
                </div>
            )}
            <div id={'preview'} className={'mt-4'}>
                <Label>{t('general.preview')}</Label>
                {spell && (
                    <SpellInfoDisplay
                        info={{
                            ...spell,
                        }}
                    />
                )}
            </div>
            <Button
                onClick={() => {
                    if (!spell) {
                        return
                    }
                    addNewSpell(spell)
                }}
                className={'mt-2'}
                disabled={!dlc || !descriptor || !isDescriptor(`${dlc}:${descriptor}`)}
            >
                <AiOutlinePlus className={'mr-2 text-t-big text-white'} />
                {t('general.add')}
            </Button>
        </div>
    )
}

const SpellBookEditor = () => {
    const { character, updateCharacter, flags } = useCharacterEditorContext()
    const { spellBook: spellBookFlags } = flags

    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })

    const [canActivateMore, setCanActivateMore] = useState(
        checkIfCanActivateMore(character.spellBook.maxActiveSpells, character.spellBook.spells)
    )

    const refreshCheck = useCallback(() => {
        setCanActivateMore(checkIfCanActivateMore(character.spellBook.maxActiveSpells, character.spellBook.spells))
    }, [character])

    useEffect(() => {
        refreshCheck()
    }, [character])

    const changeCharacterSpellbook = useCallback(
        (index: number, value: SpellInfo) => {
            updateCharacter({
                ...character,
                spellBook: {
                    ...character.spellBook,
                    spells: character.spellBook.spells.map((spell, i) => {
                        if (i === index) {
                            return {
                                ...value,
                            }
                        }
                        return spell
                    }),
                },
            })
        },
        [character]
    )

    const removeSpell = useCallback(
        (index: number) => {
            updateCharacter({
                ...character,
                spellBook: {
                    ...character.spellBook,
                    spells: character.spellBook.spells.filter((_, i) => i !== index),
                },
            })
        },
        [character]
    )

    return (
        <div id={'spell-book'} className={'flex flex-col gap-4'}>
            <Accordion type={'single'} collapsible>
                <AccordionItem value={'add-new-spell'}>
                    <AccordionTrigger className={'text-t-normal'}>{t('spellBook.add')}</AccordionTrigger>
                    <AccordionContent>
                        <AddNewSpellComponent />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {character.spellBook.spells.length === 0 && <EmptyFeatureContent />}
            {character.spellBook.spells.map((spell, index) => {
                return (
                    <div key={index}>
                        <div id={'editing-bar'} className={'mb-2 flex items-center justify-between gap-1'}>
                            <div className={'flex flex-row items-center'}>
                                <Checkbox
                                    checked={spell.isActive ?? false}
                                    onCheckedChange={(e) => {
                                        if (!spellBookFlags?.allowActivation) {
                                            return
                                        }
                                        changeCharacterSpellbook(index, {
                                            ...spell,
                                            isActive: typeof e === 'boolean' ? e : !spell.isActive,
                                        })
                                    }}
                                    disabled={!spellBookFlags?.allowActivation || (!canActivateMore && !spell.isActive)}
                                />
                                <Label className={'ml-1 text-[1rem] text-black'}>{t('general.is-active')}</Label>
                            </div>
                            <Button
                                className={'h-6 w-16 transition-all hover:bg-red-500'}
                                id={'remove-button'}
                                title={t('general.remove')}
                                onDoubleClick={() => {
                                    removeSpell(index)
                                }}
                            >
                                <RiDeleteBin6Line className={'text-[1rem] text-white'} />
                            </Button>
                        </div>
                        <SpellInfoDisplay key={index} info={spell} />
                    </div>
                )
            })}
        </div>
    )
}

export default SpellBookEditor
