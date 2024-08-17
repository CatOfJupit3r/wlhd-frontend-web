import React, { useCallback, useEffect, useState } from 'react'
import { ItemInfo } from '@models/Battlefield'
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
import { Input } from '@components/ui/input'
import { ItemInfoDisplay } from '@components/InfoDisplay/InfoDisplay'
import { Button } from '@components/ui/button'
import { isDescriptor } from '@utils'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdExposureNeg1, MdPlusOne } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import { useDataContext } from '@components/ContextProviders/GameDataProvider'
import { useCharacterEditorContext } from '@components/ContextProviders/CharacterEditorProvider'
import { getHandlerChange } from '@components/CharacterEditor/GameComponentEditors/editorUtils'
import { useTranslation } from 'react-i18next'
import { EmptyMenuContent } from '@components/ui/menu'
import { SUPPORTED_DLCs } from 'config'

const AddNewItemComponent = () => {
    const { character, updateCharacter, flags } = useCharacterEditorContext()
    const { inventory: inventoryFlags } = flags
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })

    const addNewItem = useCallback(
        (item: ItemInfo) => {
            updateCharacter({
                ...character,
                inventory: character.inventory.concat(item),
            })
        },
        [character]
    )

    const [dlc, setDlc] = useState('')
    const [descriptor, setDescriptor] = useState('')

    const { items, fetchAndSetItems } = useDataContext()

    const [item, setItem] = useState<ItemInfo | null>(null)

    useEffect(() => {
        if (dlc && (items === null || items?.[dlc] === undefined)) {
            fetchAndSetItems(dlc).catch(console.error)
        }
    }, [dlc, items])

    const getItemFromLoadedItems = useCallback(
        (dlc: string, descriptor: string) => {
            return items?.[dlc]?.[descriptor] ?? null
        },
        [dlc, items]
    )

    useEffect(() => {
        const item = getItemFromLoadedItems(dlc, descriptor)
        if (item) {
            setItem(item)
        }
    }, [dlc, descriptor])

    return (
        <div id={'add-new-item'}>
            <div>
                <div className={'flex flex-col gap-2'}>
                    <div>
                        <Label>{t('general.dlc')}</Label>
                        <Select
                            onValueChange={(value) => {
                                setDescriptor('')
                                setItem(null)
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
                                ...Object.keys(items?.[dlc] ?? {}).map((descriptor) => ({
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
            {item && (
                <div>
                    {inventoryFlags?.allowQuantity && (
                        <div>
                            <Label>{t('general.quantity')}</Label>
                            <Input
                                placeholder={t('general.quantity')}
                                value={item.quantity}
                                type={'number'}
                                className={'w-[6ch]'}
                                onChange={getHandlerChange(256, 1, (value) => setItem({ ...item, quantity: value }), 1)}
                            />
                        </div>
                    )}
                    {inventoryFlags?.allowCooldown &&
                        (inventoryFlags?.allowExceedCooldown ? (
                            <div>
                                <Label>{t('general.cooldown')}</Label>
                                <Input
                                    placeholder={t('general.cooldown')}
                                    value={item.cooldown.current}
                                    type={'number'}
                                    className={'w-[6ch]'}
                                    onChange={getHandlerChange(
                                        99,
                                        0,
                                        (value) => setItem({ ...item, cooldown: { ...item.cooldown, current: value } }),
                                        0
                                    )}
                                />
                            </div>
                        ) : (
                            item.cooldown.max !== null &&
                            item.cooldown.max !== 0 && (
                                <>
                                    <Label>{t('general.cooldown')}</Label>
                                    <Input
                                        placeholder={t('general.cooldown')}
                                        value={item.cooldown.current}
                                        type={'number'}
                                        className={'w-[6ch]'}
                                        onChange={getHandlerChange(
                                            item?.cooldown.max ?? 0,
                                            0,
                                            (value) =>
                                                setItem({ ...item, cooldown: { ...item.cooldown, current: value } }),
                                            0
                                        )}
                                    />
                                </>
                            )
                        ))}
                    {inventoryFlags?.allowUses && item.uses.max !== null && item.uses.max !== 0 && (
                        <div>
                            <Label>{t('general.uses')}</Label>
                            <Input
                                placeholder={t('general.uses')}
                                value={item.uses.current}
                                type={'number'}
                                min={0}
                                max={item?.uses.max ?? 99}
                                className={'w-[6ch]'}
                                onChange={getHandlerChange(
                                    item?.uses.max ?? 0,
                                    0,
                                    (value) => setItem({ ...item, uses: { ...item.uses, current: value } }),
                                    0
                                )}
                            />
                        </div>
                    )}
                </div>
            )}
            <div id={'preview'} className={'mt-4'}>
                <Label>{t('general.preview')}</Label>
                {item && <ItemInfoDisplay info={item} />}
            </div>
            <Button
                onClick={() => {
                    if (item) {
                        addNewItem(item)
                    }
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

const InventoryEditor = () => {
    const { character, updateCharacter } = useCharacterEditorContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })

    const changeCharacterInventory = useCallback(
        (index: number, value: ItemInfo) => {
            updateCharacter({
                ...character,
                inventory: character.inventory.map((item, i) => {
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

    const removeItem = useCallback(
        (index: number) => {
            updateCharacter({
                ...character,
                inventory: character.inventory.filter((_, i) => i !== index),
            })
        },
        [character]
    )

    return (
        <div id={'inventory'} className={'flex flex-col gap-4'}>
            <Accordion type={'single'} collapsible>
                <AccordionItem value={'add-new-item'}>
                    <AccordionTrigger className={'text-t-normal'}>{t('inventory.add')}</AccordionTrigger>
                    <AccordionContent>
                        <AddNewItemComponent />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {character.inventory.map((item, index) => {
                return (
                    <div key={index}>
                        <div
                            id={'editing-bar'}
                            className={'mb-2 flex h-6 w-full justify-end gap-1 text-[1rem] text-white'}
                        >
                            <Button
                                className={'h-full transition-all'}
                                id={'decrement'}
                                title={t('inventory.decrease-quantity')}
                                onMouseDown={() => {
                                    changeCharacterInventory(index, {
                                        ...item,
                                        quantity: item.quantity - 1,
                                    })
                                }}
                                disabled={item.quantity <= 1}
                            >
                                <MdExposureNeg1 />
                            </Button>
                            <Button
                                className={'h-full transition-all'}
                                id={'increment'}
                                title={t('inventory.increase-quantity')}
                                onMouseDown={() => {
                                    changeCharacterInventory(index, {
                                        ...item,
                                        quantity: item.quantity + 1,
                                    })
                                }}
                                disabled={item.quantity >= 99}
                            >
                                <MdPlusOne />
                            </Button>
                            <Button
                                className={'h-full transition-all hover:bg-red-500'}
                                id={'remove-button'}
                                title={t('inventory.remove')}
                                onDoubleClick={() => {
                                    removeItem(index)
                                }}
                            >
                                <RiDeleteBin6Line />
                            </Button>
                        </div>
                        <ItemInfoDisplay key={index} info={item} />
                    </div>
                )
            })}
            {character.inventory.length === 0 && <EmptyMenuContent />}
        </div>
    )
}

export default InventoryEditor
