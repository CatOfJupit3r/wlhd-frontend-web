import { IndividualTagDisplay } from '@components/InfoDisplay/TagsDisplay'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import { Button, ButtonWithTooltip } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Separator } from '@components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import useDualTranslation from '@hooks/useDualTranslation'
import {
    CharacterDataInSave,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@models/CombatEditorModels'
import { DiceMemory, GameComponentMemory, PossibleMemory } from '@models/GameModels'
import { OneOf } from '@models/OneOf'
import { capitalizeFirstLetter, cn } from '@utils'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FaBoxes, FaHourglassHalf } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { LuTally5, LuTriangle } from 'react-icons/lu'
import { PiClockCountdownBold, PiSneakerMoveFill } from 'react-icons/pi'

const useComponentEditorTranslation = () => {
    return useTranslation('local', {
        keyPrefix: 'editor.shared',
    })
}

export const getHandlerChange = (max: number, min: number, set: (value: number) => void, fallbackValue: number = 1) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === '') {
            set(fallbackValue)
        } else {
            const parsedValue = parseInt(value)
            if (isNaN(parsedValue)) {
                set(fallbackValue)
            } else if (parsedValue < min) {
                set(min)
            } else if (parsedValue > max) {
                set(max)
            } else {
                set(parsedValue)
            }
        }
    }
}
export type AllowedEditables = OneOf<[ItemEditable, WeaponEditable, SpellEditable, StatusEffectEditable]>
type ComponentPartEditorProps = {
    component: AllowedEditables
    changeComponentField: (key: keyof AllowedEditables, value: AllowedEditables[keyof AllowedEditables]) => void
}

const EditorLabel: React.FC<{
    text: string
    icon: React.ReactNode
    className?: string
}> = ({ text, icon, className }) => {
    return (
        <div className={'flex flex-row items-center gap-1 text-sm font-bold ' + className}>
            {icon}
            {text}
        </div>
    )
}

export const ActivenessEditor: React.FC<ComponentPartEditorProps & { disabled: boolean }> = ({
    component,
    changeComponentField,
    disabled,
}) => {
    const usable = component?.isActive ? true : !disabled
    const { t } = useComponentEditorTranslation()

    return (
        <ButtonWithTooltip
            className={cn(
                'size-8 bg-transparent p-0 text-lg text-green-600 hover:bg-green-200',
                'transform transition-colors duration-200 ease-in-out hover:text-green-800',
                component?.isActive ? 'opacity-100' : 'opacity-40'
            )}
            onClick={() => {
                if (usable) {
                    changeComponentField('isActive', !component?.isActive)
                }
            }}
            tooltip={t('is-active-tooltip')}
            tooltipClassname={'text-sm font-normal'}
            disabled={!usable}
        >
            <LuTriangle />
        </ButtonWithTooltip>
    )
}
export const QuantityEditor: React.FC<ComponentPartEditorProps> = ({ component, changeComponentField }) => {
    const { t } = useComponentEditorTranslation()

    return (
        <div>
            <EditorLabel text={t('quantity')} icon={<FaBoxes />} />
            <Input
                type={'number'}
                value={component.quantity}
                onChange={getHandlerChange(99, 1, (value) => changeComponentField('quantity', value))}
                className={'w-20'}
            />
        </div>
    )
}
export const UsesEditor: React.FC<ComponentPartEditorProps> = ({ component, changeComponentField }) => {
    const { t } = useComponentEditorTranslation()
    return (
        <div>
            <EditorLabel text={t('component-uses')} icon={<LuTally5 />} />
            <div className={'flex flex-row items-center gap-2'}>
                <div className={'flex flex-row items-center gap-2 text-sm font-normal italic'}>
                    <Input
                        type={'number'}
                        value={component.currentConsecutiveUses}
                        onChange={getHandlerChange(99, 1, (value) =>
                            changeComponentField('currentConsecutiveUses', value)
                        )}
                        className={'w-20'}
                    />
                    /
                    <Input
                        type={'number'}
                        value={component.maxConsecutiveUses ?? 0}
                        onChange={getHandlerChange(99, 0, (value) => changeComponentField('maxConsecutiveUses', value))}
                        className={'w-20'}
                    />
                </div>
            </div>
        </div>
    )
}
export const DurationEditor: React.FC<ComponentPartEditorProps> = ({ component, changeComponentField }) => {
    const { t } = useComponentEditorTranslation()
    return (
        <div>
            <EditorLabel text={t('duration')} icon={<FaHourglassHalf />} />
            <Input
                type={'number'}
                value={component.duration ?? 0}
                onChange={getHandlerChange(99, 0, (value) => changeComponentField('duration', value))}
                className={'w-20'}
            />
        </div>
    )
}

export const CooldownEditor: React.FC<ComponentPartEditorProps> = ({ component, changeComponentField }) => {
    const { t } = useComponentEditorTranslation()
    return (
        <div>
            <EditorLabel text={t('cooldown')} icon={<PiClockCountdownBold />} />
            <div className={'flex flex-row items-center gap-1 text-sm font-normal italic'}>
                <Input
                    type={'number'}
                    value={component.turnsUntilUsage}
                    onChange={getHandlerChange(99, 0, (value) => changeComponentField('turnsUntilUsage', value))}
                    className={'w-20'}
                />
                /
                <Input
                    type={'number'}
                    value={component.cooldownValue ?? 0}
                    onChange={getHandlerChange(99, 0, (value) => changeComponentField('cooldownValue', value))}
                    className={'w-20'}
                />
            </div>
        </div>
    )
}
export const CostEditor: React.FC<ComponentPartEditorProps> = ({ component, changeComponentField }) => {
    const { t } = useComponentEditorTranslation()

    return (
        <div>
            <EditorLabel text={t('cost-to-use')} icon={<PiSneakerMoveFill />} />
            <Input
                type={'number'}
                value={component.usageCost ?? 0}
                onChange={getHandlerChange(99, 0, (value) => changeComponentField('usageCost', value))}
                className={'w-20'}
            />
        </div>
    )
}

const MemoryValueEditor: React.FC<{
    value: PossibleMemory['value']
    type: PossibleMemory['type']
    change: (value: PossibleMemory['value']) => void
}> = ({ value, type, change }) => {
    switch (type) {
        case 'dice':
            return (
                <div className={'flex flex-row items-center gap-2'}>
                    <Input
                        type={'number'}
                        value={(value as DiceMemory['value']).amount}
                        onChange={(e) => {
                            if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
                                change({
                                    amount: 0,
                                    sides: (value as DiceMemory['value']).sides,
                                })
                                return
                            }
                            change({
                                amount: parseInt(e.target.value),
                                sides: (value as DiceMemory['value']).sides,
                            })
                        }}
                        className={'w-20'}
                    />
                    d
                    <Input
                        type={'number'}
                        value={(value as DiceMemory['value']).sides}
                        onChange={(e) => {
                            if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
                                change({
                                    amount: (value as DiceMemory['value']).amount,
                                    sides: 0,
                                })
                                return
                            }
                            change({
                                amount: (value as DiceMemory['value']).amount,
                                sides: parseInt(e.target.value),
                            })
                        }}
                        className={'w-20'}
                    />
                </div>
            )
        case 'element_of_hp_change':
        case 'state':
        case 'string':
            return (
                <Input
                    type={'text'}
                    value={value as string}
                    onChange={(e) => {
                        change(e.target.value)
                    }}
                    className={'w-full'}
                />
            )
        case 'number':
            return (
                <Input
                    type={'number'}
                    value={value as number}
                    onChange={(e) => {
                        change(parseInt(e.target.value))
                    }}
                    className={'w-full'}
                />
            )
        case 'boolean':
            return (
                <input
                    type={'checkbox'}
                    checked={value as boolean}
                    onChange={(e) => {
                        change(e.target.checked)
                    }}
                />
            )
        case 'state_change_mode':
            return (
                <input
                    type={'checkbox'}
                    checked={value as boolean}
                    onChange={(e) => {
                        change(e.target.checked ? '+' : '-')
                    }}
                />
            )
        case 'type_of_hp_change':
            return (
                <Select
                    onValueChange={(value) => {
                        if (value) {
                            change(value as 'damage' | 'heal')
                        }
                    }}
                    value={value as string}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={'Select type of hp change'} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={'damage'}>Damage</SelectItem>
                            <SelectItem value={'heal'}>Heal</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )
        case 'component_id':
            return (
                <Input
                    type={'text'}
                    value={value as string}
                    onChange={(e) => {
                        change(e.target.value)
                    }}
                    className={'w-full'}
                />
            )
        default:
            return null
    }
}

const MemoryTypeEditor: React.FC<{
    type: PossibleMemory['type']
    change: (params: { type: PossibleMemory['type']; value: PossibleMemory['value'] }) => void
}> = ({ type, change }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'editor.memories.type-select',
    })
    return (
        <Select
            onValueChange={(value) => {
                if (!value || value === type) {
                    return
                }
                const modifiedMemory: {
                    type: PossibleMemory['type']
                    value: PossibleMemory['value']
                } = { type, value: '' }
                switch (value) {
                    case 'string':
                        modifiedMemory.type = 'string'
                        modifiedMemory.value = ''
                        break
                    case 'number':
                        modifiedMemory.type = 'number'
                        modifiedMemory.value = 0
                        break
                    case 'boolean':
                        modifiedMemory.type = 'boolean'
                        modifiedMemory.value = false
                        break
                    case 'dice':
                        modifiedMemory.type = 'dice'
                        modifiedMemory.value = {
                            sides: 0,
                            amount: 0,
                        }
                        break
                    case 'component_id':
                        modifiedMemory.type = 'component_id'
                        modifiedMemory.value = ''
                        break
                    case 'element_of_hp_change':
                        modifiedMemory.type = 'element_of_hp_change'
                        modifiedMemory.value = 'builtins:physical'
                        break
                    case 'type_of_hp_change':
                        modifiedMemory.type = 'type_of_hp_change'
                        modifiedMemory.value = 'damage'
                        break
                    case 'state':
                        modifiedMemory.type = 'state'
                        modifiedMemory.value = ''
                        break
                    case 'state_change_mode':
                        modifiedMemory.type = 'state_change_mode'
                        modifiedMemory.value = '+'
                        break
                    default:
                        break
                }
                change(modifiedMemory)
            }}
            value={type}
        >
            <SelectTrigger>
                <SelectValue placeholder={t('placeholder')} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value={'string'}>{t('supported-types.string')}</SelectItem>
                    <SelectItem value={'number'}>{t('supported-types.number')}</SelectItem>
                    <SelectItem value={'boolean'}>{t('supported-types.boolean')}</SelectItem>
                    <SelectItem value={'dice'}>{t('supported-types.dice')}</SelectItem>
                    <SelectItem value={'component_id'}>{t('supported-types.component-id')}</SelectItem>
                    <SelectItem value={'element_of_hp_change'}>{t('supported-types.element-of-hp-change')}</SelectItem>
                    <SelectItem value={'type_of_hp_change'}>{t('supported-types.type-of-hp-change')}</SelectItem>
                    <SelectItem value={'state'}>{t('supported-types.state')}</SelectItem>
                    <SelectItem value={'state_change_mode'}>{t('supported-types.state-change-mode')}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const IndividualMemoryEditor: React.FC<{
    memory_key: string
    memory: PossibleMemory
    change: (key: string, memory: PossibleMemory) => void
    defaultSimplified?: boolean
}> = ({ memory_key, memory, change, defaultSimplified }) => {
    const { type, value } = memory
    const { t } = useDualTranslation('local', {
        keyPrefix: 'editor.memories',
    })
    const [simplified, setSimplified] = React.useState<boolean>(defaultSimplified ?? true)

    const setMemory = useCallback(
        (value: PossibleMemory['value']) => {
            change(memory_key, {
                ...memory,
                value,
            } as PossibleMemory)
        },
        [change, memory_key, memory]
    )

    return (
        <div className={'flex w-full flex-col gap-2 border-y-2 p-2'}>
            <div className={'flex w-full flex-row justify-end gap-1'}>
                <input
                    type={'checkbox'}
                    checked={simplified}
                    onChange={(e) => {
                        setSimplified(e.target.checked)
                    }}
                />
                <Label>{t('simplified')}</Label>
            </div>
            {simplified ? (
                <Tooltip>
                    <TooltipTrigger>
                        <div className={'cursor-default text-base font-bold'}>
                            {capitalizeFirstLetter(t(memory.display_name, { includePrefix: false })) || memory_key}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {memory_key}
                        {memory.internal ? ` ${t('internal-postfix')}` : ''}
                    </TooltipContent>
                </Tooltip>
            ) : (
                <>
                    <div>
                        <Label>{t('memory-key')}</Label>
                        <Input
                            type={'text'}
                            value={memory_key}
                            onChange={(e) => {
                                change(e.target.value, memory)
                            }}
                        />
                    </div>
                    <div>
                        <Label>{t('display-name')}</Label>
                        <Input
                            type={'text'}
                            value={memory.display_name}
                            onChange={(e) => {
                                change(memory_key, {
                                    ...memory,
                                    display_name: e.target.value,
                                } as PossibleMemory)
                            }}
                        />
                    </div>
                    <div>
                        <Label>{t('display-value')}</Label>
                        <Input
                            type={'text'}
                            value={memory.display_value}
                            onChange={(e) => {
                                change(memory_key, {
                                    ...memory,
                                    display_value: e.target.value,
                                } as PossibleMemory)
                            }}
                        ></Input>
                    </div>
                    <div className={'flex flex-row items-center gap-1'}>
                        <input
                            type={'checkbox'}
                            checked={memory.internal}
                            onChange={(e) => {
                                change(memory_key, {
                                    ...memory,
                                    internal: e.target.checked,
                                } as PossibleMemory)
                            }}
                        />
                        <Label>{t('internal')}</Label>
                    </div>
                </>
            )}

            <div className={'flex flex-col gap-1'}>
                <Label>{t('type')}</Label>
                <MemoryTypeEditor
                    type={type}
                    change={(params) => {
                        change(memory_key, {
                            ...memory,
                            type: params.type,
                            value: params.value,
                        } as PossibleMemory)
                    }}
                />
            </div>
            <div className={'flex flex-col items-start gap-1'}>
                <Label>{t('memory-value')}</Label>
                <MemoryValueEditor value={value} type={type} change={setMemory} />
            </div>
        </div>
    )
}

type CharacterEditorProps = {
    // characters can have memories too,
    // however, their structure is a bit different, so we don't pass
    component: CharacterDataInSave
    changeComponentField: (key: 'tags' | 'memory', value: GameComponentMemory | string[]) => void
}

type CharacterSupportedEditorProps = OneOf<[CharacterEditorProps, ComponentPartEditorProps]>

export const MemoriesEditor: React.FC<CharacterSupportedEditorProps> = ({ component, changeComponentField }) => {
    const changeMemory = useCallback(
        (key: string, memory: PossibleMemory) => {
            changeComponentField('memory', {
                ...component.memory,
                [key]: memory,
            })
        },
        [component.memory, changeComponentField]
    )
    if (!component.memory) {
        return null
    }

    return (
        <div className={'flex w-full flex-col items-start gap-2 px-5'}>
            {
                // if there are no memories, then we show a message
                Object.entries(component.memory).map(([memory_key, memory], index) => {
                    return (
                        <IndividualMemoryEditor
                            memory_key={memory_key}
                            memory={memory}
                            change={changeMemory}
                            key={index}
                        />
                    )
                })
            }
        </div>
    )
}

export const CreateNewMemory: React.FC<CharacterSupportedEditorProps> = (props) => {
    const { t } = useDualTranslation('local', { keyPrefix: 'editor' })
    const [key, setKey] = React.useState('new_key')
    const [memory, setMemory] = React.useState<PossibleMemory>({
        type: 'string',
        value: '',
        display_name: '',
        display_value: '',
        internal: false,
    } as PossibleMemory)

    return (
        <div className={'flex flex-col gap-4'}>
            <IndividualMemoryEditor
                memory_key={key}
                memory={memory}
                change={(innerKey, memory) => {
                    setKey(innerKey)
                    setMemory(memory)
                }}
                defaultSimplified={false}
            />
            <Button
                onClick={() => {
                    if (key === '') {
                        return
                    }
                    props.changeComponentField('memory', {
                        ...props.component.memory,
                        [key]: memory,
                    })
                }}
            >
                {t('memories.btn-add')}
            </Button>
        </div>
    )
}

export const CreateNewMemoryWithAccordion: React.FC<CharacterSupportedEditorProps> = (props) => {
    const { t } = useDualTranslation('local', { keyPrefix: 'editor' })
    return (
        <Accordion type={'single'} collapsible>
            <AccordionItem value={'add-new-memory'}>
                <AccordionTrigger className={'text-base'}>{t('memories.add')}</AccordionTrigger>
                <AccordionContent>
                    <CreateNewMemory {...props} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const IndividualTagEditor: React.FC<{
    tag: string
    deleteSelf: () => void
}> = ({ tag, deleteSelf }) => {
    return (
        <IndividualTagDisplay tag={tag} badgeVariant={'outline'}>
            <Button
                onClick={() => {
                    deleteSelf()
                }}
                className={'ml-1 h-4 w-4 rounded-none p-0'}
                variant={'ghost'}
            >
                <FaX />
            </Button>
        </IndividualTagDisplay>
    )
}

const AddNewTag: React.FC<{ addTag: (tag: string) => void }> = ({ addTag }) => {
    const [tag, setTag] = React.useState('')
    const { t } = useDualTranslation('local', { keyPrefix: 'editor' })
    return (
        <div className={'flex flex-row gap-2 p-1'}>
            <Input
                type={'text'}
                value={tag}
                onChange={(e) => {
                    setTag(e.target.value)
                }}
                placeholder={t('tags.add')}
            />
            <Button
                onClick={() => {
                    addTag(tag)
                    setTag('')
                }}
            >
                {t('tags.btn-add')}
            </Button>
        </div>
    )
}

export const TagsEditor: React.FC<CharacterSupportedEditorProps> = ({ component, changeComponentField }) => {
    // tags is an array of descriptors, which are help to categorize the component
    // currently, there is no registry of these tags, so we allow to add any string
    // when displayed, tags are rendered with prefix `<dlc_tag>:tags.<remaining_tag>`

    return (
        <div className={'flex flex-col gap-2'}>
            <div id={'existing-tags'}>
                {component.tags.map((tag, index) => {
                    return (
                        <IndividualTagEditor
                            key={index}
                            tag={tag}
                            deleteSelf={() => {
                                const newTags = [...component.tags]
                                newTags.splice(index, 1)
                                changeComponentField('tags', newTags)
                            }}
                        />
                    )
                })}
            </div>
            {component.tags && component.tags.length > 0 ? <Separator /> : null}
            <AddNewTag
                addTag={(tag) => {
                    changeComponentField('tags', [...component.tags, tag])
                }}
            />
        </div>
    )
}
