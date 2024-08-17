import React, { useCallback, useEffect, useState } from 'react'
import { StatusEffectInfo } from '@models/Battlefield'
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
import { Combobox } from '@components/ui/combobox'
import { StatusEffectInfoDisplay } from '@components/InfoDisplay/InfoDisplay'
import { Button } from '@components/ui/button'
import { isDescriptor } from '@utils'
import { AiOutlinePlus } from 'react-icons/ai'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { MdExposureNeg1, MdPlusOne } from 'react-icons/md'
import { Input } from '@components/ui/input'
import { useDataContext } from '@components/ContextProviders/GameDataProvider'
import { useCharacterEditorContext } from '@components/ContextProviders/CharacterEditorProvider'
import { useTranslation } from 'react-i18next'
import { EmptyMenuContent } from '@components/ui/menu'
import { SUPPORTED_DLCs } from 'config'

function AddNewEffectComponent() {
    const { character, updateCharacter, flags } = useCharacterEditorContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })
    const { statusEffects: statusEffectsFlags } = flags

    const addNewStatusEffect = useCallback(
        (item: StatusEffectInfo) => {
            updateCharacter({
                ...character,
                statusEffects: character.statusEffects.concat(item),
            })
        },
        [character]
    )

    const [dlc, setDlc] = useState('')
    const [descriptor, setDescriptor] = useState('')

    const { statusEffects, fetchAndSetStatusEffects } = useDataContext()
    const [effect, setEffect] = useState<StatusEffectInfo | null>(null)

    useEffect(() => {
        if (dlc && (statusEffects === null || statusEffects?.[dlc] === undefined)) {
            fetchAndSetStatusEffects(dlc).catch(console.error)
        }
    }, [dlc, statusEffects])

    const getItemFromLoadedItems = useCallback(
        (dlc: string, descriptor: string) => {
            return statusEffects?.[dlc]?.[descriptor] ?? null
        },
        [dlc, statusEffects]
    )

    useEffect(() => {
        const item = getItemFromLoadedItems(dlc, descriptor)
        if (item) {
            setEffect(item)
        }
    }, [dlc, descriptor])

    return (
        <div id={'add-new-status-effect'}>
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
                            items={[
                                ...Object.keys(statusEffects?.[dlc] ?? {}).map((descriptor) => ({
                                    value: descriptor,
                                    label: descriptor,
                                })),
                            ]}
                            value={descriptor}
                            onChange={(e) => {
                                setDescriptor(e)
                            }}
                        />
                    </div>
                </div>
            </div>
            {effect && (
                <div>
                    {statusEffectsFlags?.allowDuration && (
                        <>
                            <Label>{t('general.duration')}</Label>
                            <Input
                                placeholder={t('general.infinity')}
                                disabled={!effect}
                                value={effect.duration || ''}
                                onChange={(e) => {
                                    const eventValue = e.target.value
                                    if (eventValue === '') {
                                        setEffect({
                                            ...effect,
                                            duration: null,
                                        })
                                    } else {
                                        const parsedValue = parseInt(eventValue)
                                        if (isNaN(parsedValue)) {
                                            setEffect({
                                                ...effect,
                                                duration: null,
                                            })
                                        } else if (parsedValue < 0) {
                                            setEffect({
                                                ...effect,
                                                duration: null,
                                            })
                                        } else if (parsedValue > 999) {
                                            setEffect({
                                                ...effect,
                                                duration: '999',
                                            })
                                        } else {
                                            setEffect({
                                                ...effect,
                                                duration: parsedValue.toString(),
                                            })
                                        }
                                    }
                                }}
                            />
                        </>
                    )}
                </div>
            )}
            <div id={'preview'} className={'mt-4'}>
                <Label>{t('general.preview')}</Label>
                {effect && <StatusEffectInfoDisplay info={effect} />}
            </div>
            <Button
                onClick={() => {
                    if (!effect) {
                        return
                    }
                    addNewStatusEffect(effect)
                }}
                className={'mt-2'}
                disabled={!dlc || !descriptor || !isDescriptor(`${dlc}:${descriptor}`) || !effect}
            >
                <AiOutlinePlus className={'mr-2 text-t-big text-white'} />
                {t('general.add')}
            </Button>
        </div>
    )
}

const StatusEffectsEditor = () => {
    const { character, updateCharacter } = useCharacterEditorContext()

    const {t} = useTranslation('local', {
        keyPrefix: 'editor',
    })

    const changeCharacterStatusEffects = useCallback(
        (index: number, value: StatusEffectInfo) => {
            updateCharacter({
                ...character,
                statusEffects: character.statusEffects.map((item, i) => {
                    if (i === index) {
                        return {
                            ...value,
                        }
                    }
                    return item
                }),
            })
        },
        [character]
    )

    const removeStatusEffect = useCallback(
        (index: number) => {
            updateCharacter({
                ...character,
                statusEffects: character.statusEffects.filter((_, i) => i !== index),
            })
        },
        [character]
    )

    return (
        <div id={'status_effects'} className={'flex flex-col gap-4'}>
            <Accordion type={'single'} collapsible>
                <AccordionItem value={'add-new-item'}>
                    <AccordionTrigger className={'text-t-normal'}>{t('statusEffects.add')}</AccordionTrigger>
                    <AccordionContent>
                        <AddNewEffectComponent />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {character.statusEffects.length === 0 && <EmptyMenuContent />}
            {character.statusEffects.map((item, index) => {
                return (
                    <div key={index}>
                        <div
                            id={'editing-bar'}
                            className={'mb-2 flex h-6 w-full justify-end gap-1 text-[1rem] text-white'}
                        >
                            <Button
                                className={'h-full w-12 transition-all'}
                                id={'decrease-duration'}
                                title={t('statusEffects.decrease-duration')}
                                onClick={() => {
                                    changeCharacterStatusEffects(index, {
                                        ...item,
                                        duration:
                                            item.duration === '1' || item.duration === null
                                                ? null
                                                : (parseInt(item.duration || '2') - 1).toString(),
                                    })
                                }}
                                disabled={item.duration === null}
                            >
                                <MdExposureNeg1 />
                            </Button>
                            <Button
                                className={'transition-all h-full w-12'}
                                id={'increase-duration'}
                                title={t('statusEffects.increase-duration')}
                                onClick={() => {
                                    changeCharacterStatusEffects(index, {
                                        ...item,
                                        duration: (parseInt(item.duration || '0') + 1).toString(),
                                    })
                                }}
                            >
                                <MdPlusOne />
                            </Button>
                            <Button
                                className={'transition-all h-full w-16 hover:bg-red-500'}
                                id={'remove-button'}
                                title={t('statusEffects.remove')}
                                onDoubleClick={() => {
                                    removeStatusEffect(index)
                                }}
                            >
                                <RiDeleteBin6Line />
                            </Button>
                        </div>
                        <StatusEffectInfoDisplay key={index} info={item} />
                    </div>
                )
            })}
        </div>
    )
}

export default StatusEffectsEditor
