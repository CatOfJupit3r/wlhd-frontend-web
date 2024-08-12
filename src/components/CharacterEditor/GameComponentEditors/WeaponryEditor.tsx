import React, { useCallback, useEffect, useState } from 'react'
import { EntityInfoFull, WeaponInfo } from '@models/Battlefield'
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
import { SpellInfoDisplay, WeaponInfoDisplay } from '@components/InfoDisplay/InfoDisplay'
import { Button } from '@components/ui/button'
import { isDescriptor } from '@utils'
import { AiOutlinePlus } from 'react-icons/ai'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import { Checkbox } from '@components/ui/checkbox'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Input } from '@components/ui/input'
import { EmptyFeatureContent } from '@components/CharacterDisplay/CharacterFeatures/FeatureContainer'
import { useDataContext } from '@components/ContextProviders/GameDataProvider'
import { useCharacterEditorContext } from '@components/ContextProviders/CharacterEditorProvider'
import { getHandlerChange } from '@components/CharacterEditor/GameComponentEditors/editorUtils'
import { useTranslation } from 'react-i18next'

const checkIfCanActivateMore = (weaponry: EntityInfoFull['weaponry']) => {
    return weaponry.filter((weapon) => weapon.isActive).length === 0
}

function AddNewWeaponComponent() {
    const { character, updateCharacter, flags } = useCharacterEditorContext()
    const { weaponry: weaponryFlags } = flags
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })

    const addNewWeapon = useCallback(
        (weapon: WeaponInfo) => {
            updateCharacter({
                ...character,
                weaponry: [...character.weaponry, weapon],
            })
        },
        [character]
    )
    const [dlc, setDlc] = useState('')
    const [descriptor, setDescriptor] = useState('')

    const { weapons, fetchAndSetWeapons } = useDataContext()

    const [weapon, setWeapon] = useState<WeaponInfo | null>(null)

    useEffect(() => {
        if (dlc && (weapons === null || weapons?.[dlc] === undefined)) {
            fetchAndSetWeapons(dlc).catch(console.error)
        }
    }, [dlc, weapons])

    const getWeaponFromLoadedWeapons = useCallback(
        (dlc: string, descriptor: string) => {
            return weapons?.[dlc]?.[descriptor] ?? null
        },
        [dlc, weapons]
    )

    useEffect(() => {
        const item = getWeaponFromLoadedWeapons(dlc, descriptor)
        if (item) {
            setWeapon(item)
        }
    }, [dlc, descriptor])

    return (
        <div id={'add-new-weapon'}>
            <div>
                <div className={'flex flex-col gap-2'}>
                    <div>
                        <Label>{t('general.dlc')}</Label>
                        <Select
                            onValueChange={(value) => {
                                setWeapon(null)
                                setDescriptor('')

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
                                ...Object.keys(weapons?.[dlc] ?? {}).map((descriptor) => ({
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
                    {weapon && (
                        <div id={'other-variables'}>
                            {weaponryFlags?.allowQuantity && (
                                <div>
                                    <Label>{t('general.quantity')}</Label>
                                    <Input
                                        placeholder={t('general.quantity')}
                                        value={weapon.quantity}
                                        type={'number'}
                                        className={'w-[6ch]'}
                                        onChange={getHandlerChange(
                                            256,
                                            1,
                                            (value) =>
                                                setWeapon({
                                                    ...weapon,
                                                    quantity: value,
                                                }),
                                            1
                                        )}
                                    />
                                </div>
                            )}
                            {weaponryFlags?.allowCooldown &&
                                weapon.cooldown.max !== null &&
                                weapon.cooldown.max !== 0 && (
                                    <div>
                                        <Label>{t('general.cooldown')}</Label>
                                        <Input
                                            placeholder={t('general.cooldown')}
                                            value={weapon?.cooldown.current}
                                            onChange={getHandlerChange(
                                                weapon.cooldown.max,
                                                0,
                                                (value) => {
                                                    setWeapon({
                                                        ...weapon,
                                                        cooldown: {
                                                            ...weapon.cooldown,
                                                            current: value,
                                                        },
                                                    })
                                                },
                                                0
                                            )}
                                            disabled={weapon.cooldown.max === 0}
                                        ></Input>
                                    </div>
                                )}
                            {weaponryFlags?.allowUses && weapon.uses.max !== null && weapon.uses.max !== 0 && (
                                <div>
                                    <Label>{t('general.uses')}</Label>
                                    <Input
                                        placeholder={t('general.uses')}
                                        value={weapon?.uses.current}
                                        onChange={getHandlerChange(
                                            weapon.uses.max,
                                            0,
                                            (value) => {
                                                setWeapon({
                                                    ...weapon,
                                                    uses: {
                                                        ...weapon.uses,
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
                </div>
                <div id={'preview'} className={'mt-4'}>
                    <Label>{t('general.preview')}</Label>
                    {weapon && <WeaponInfoDisplay info={weapon} />}
                </div>
                <Button
                    onClick={() => {
                        if (!weapon) {
                            return
                        }
                        addNewWeapon(weapon)
                    }}
                    disabled={!dlc || !descriptor || !isDescriptor(`${dlc}:${descriptor}`)}
                >
                    <AiOutlinePlus className={'mr-2 text-t-big text-white'} />
                    {t('general.add')}
                </Button>
            </div>
        </div>
    )
}

const WeaponryEditor = () => {
    const { character, updateCharacter, flags } = useCharacterEditorContext()
    const { weaponry } = flags
    const [canActivateMore, setCanActivateMore] = useState(checkIfCanActivateMore(character.weaponry))

    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })

    const refreshCheck = useCallback(() => {
        setCanActivateMore(checkIfCanActivateMore(character.weaponry))
    }, [character])

    useEffect(() => {
        refreshCheck()
    }, [character])

    const changeCharacterWeaponry = useCallback(
        (index: number, value: WeaponInfo) => {
            updateCharacter({
                ...character,
                weaponry: character.weaponry.map((weapon, i) => {
                    if (i === index) {
                        return {
                            ...value,
                        }
                    }
                    return weapon
                }),
            })
        },
        [character]
    )

    const removeWeapon = useCallback(
        (index: number) => {
            updateCharacter({
                ...character,
                weaponry: character.weaponry.filter((_, i) => i !== index),
            })
        },
        [character]
    )

    return (
        <div id={'weaponry'} className={'flex flex-col gap-4'}>
            <Accordion type={'single'} collapsible>
                <AccordionItem value={'add-new-weapon'}>
                    <AccordionTrigger className={'text-t-normal'}>{t('weaponry.add')}</AccordionTrigger>
                    <AccordionContent>
                        <AddNewWeaponComponent />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {character.weaponry.length === 0 && <EmptyFeatureContent />}
            {character.weaponry.map((weapon, index) => {
                return (
                    <div key={index}>
                        <div id={'editing-bar'} className={'mb-2 flex items-end justify-between gap-1'}>
                            <div className={'flex flex-row items-center'}>
                                <Checkbox
                                    checked={weapon.isActive ?? false}
                                    onCheckedChange={(e) => {
                                        if (!weaponry?.allowActivation) {
                                            return
                                        }
                                        changeCharacterWeaponry(index, {
                                            ...weapon,
                                            isActive: typeof e === 'boolean' ? e : !weapon.isActive,
                                        })
                                    }}
                                    disabled={!weaponry?.allowActivation || (!canActivateMore && !weapon.isActive)}
                                />
                                <Label className={'ml-1 text-[1rem] text-black'}>{t('general.is-active')}</Label>
                            </div>
                            <Button
                                className={'h-6 w-16 transition-all hover:bg-red-500'}
                                id={'remove-button'}
                                onDoubleClick={() => {
                                    removeWeapon(index)
                                }}
                                title={t('general.remove')}
                            >
                                <RiDeleteBin6Line className={'text-[1rem] text-white'} />
                            </Button>
                        </div>
                        <SpellInfoDisplay key={index} info={weapon} />
                    </div>
                )
            })}
        </div>
    )
}

export default WeaponryEditor
