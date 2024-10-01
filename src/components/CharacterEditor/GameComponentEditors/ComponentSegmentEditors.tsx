import { ButtonWithTooltip } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { ItemEditable, SpellEditable, StatusEffectEditable, WeaponEditable } from '@models/CombatEditorModels'
import { DiceMemory, GameComponentMemory, PossibleMemory } from '@models/GameModels'
import { OneOf } from '@models/OneOf'
import { capitalizeFirstLetter, cn } from '@utils'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FaBoxes, FaHourglassHalf } from 'react-icons/fa'
import { LuTally5, LuTriangle } from 'react-icons/lu'
import { PiClockCountdownBold, PiSneakerMoveFill } from 'react-icons/pi'

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
    changeComponentField: (key: keyof AllowedEditables, value: number | boolean | GameComponentMemory) => void
}
export const ActivenessEditor: React.FC<ComponentPartEditorProps & { disabled: boolean }> = ({
    component,
    changeComponentField,
    disabled,
}) => {
    const usable = component?.isActive ? true : !disabled

    return (
        <ButtonWithTooltip
            className={cn(
                'text-lg size-8 bg-transparent p-0 text-green-600 hover:bg-green-200',
                'transform transition-colors duration-200 ease-in-out hover:text-green-800',
                component?.isActive ? 'opacity-100' : 'opacity-40'
            )}
            onClick={() => {
                if (usable) {
                    changeComponentField('isActive', !component?.isActive)
                }
            }}
            tooltip={'Make this component active'}
            tooltipClassname={'text-t-smaller font-normal'}
            disabled={!usable}
        >
            <LuTriangle />
        </ButtonWithTooltip>
    )
}
export const QuantityEditor: React.FC<ComponentPartEditorProps> = ({ component, changeComponentField }) => {
    return (
        <div>
            <div className={'text-t-smaller font-bold'}>Quantity</div>
            <div className={'flex flex-row items-center gap-2'}>
                <FaBoxes />
                <Input
                    type={'number'}
                    value={component.quantity}
                    onChange={getHandlerChange(99, 1, (value) => changeComponentField('quantity', value))}
                    className={'w-20'}
                />
            </div>
        </div>
    )
}
export const UsesEditor: React.FC<ComponentPartEditorProps> = ({ component, changeComponentField }) => {
    return (
        <div>
            <div className={'text-t-smaller font-bold'}>Uses: Current/Max</div>
            <div className={'flex flex-row items-center gap-2'}>
                <LuTally5 />
                <div className={'flex flex-row items-center gap-2 text-t-smaller font-normal italic'}>
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
    return (
        <div>
            <div className={'text-t-smaller font-bold'}>Duration</div>
            <div className={'flex flex-row items-center gap-2'}>
                <FaHourglassHalf />
                <Input
                    type={'number'}
                    value={component.duration ?? 0}
                    onChange={getHandlerChange(99, 0, (value) => changeComponentField('duration', value))}
                    className={'w-20'}
                />
            </div>
        </div>
    )
}

export const CooldownEditor: React.FC<ComponentPartEditorProps> = ({ component, changeComponentField }) => {
    return (
        <div>
            <div className={'flex flex-row items-center gap-2'}>
                <PiClockCountdownBold />
                <div className={'text-t-smaller font-bold'}>Cooldown: Current/Max</div>
            </div>
            <div className={'flex flex-row items-center gap-1 text-t-smaller font-normal italic'}>
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
    return (
        <div>
            <div className={'text-t-smaller font-bold'}>Cost to Use</div>
            <div className={'flex flex-row items-center gap-2'}>
                <PiSneakerMoveFill />
                <Input
                    type={'number'}
                    value={component.usageCost ?? 0}
                    onChange={getHandlerChange(99, 0, (value) => changeComponentField('usageCost', value))}
                    className={'w-20'}
                />
            </div>
        </div>
    )
}

const IndividualMemoryEditor: React.FC<{
    memory_key: string
    memory: PossibleMemory
    change: (key: string, memory: PossibleMemory) => void
}> = ({ memory_key, memory, change }) => {
    const { type, value } = memory
    // if memory type is dice, then we need to show two inputs
    // else if memory type is string, then we need to show one input for string
    // else if memory type is number, then we need to show one input for number
    // else if memory type is boolean, then we need to show one input for boolean (checkbox)
    // else if memory type is component_id, then we need to show one input for string

    const setMemory = useCallback(
        (value: PossibleMemory['value']) => {
            change(memory_key, {
                ...memory,
                value,
            } as PossibleMemory)
        },
        [change, memory_key, memory]
    )

    switch (type) {
        case 'dice':
            return (
                <div className={'flex flex-row items-center gap-2'}>
                    <Input
                        type={'number'}
                        value={(value as DiceMemory['value']).amount}
                        onChange={(e) => {
                            if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
                                setMemory({
                                    amount: 0,
                                    sides: (value as DiceMemory['value']).sides,
                                })
                                return
                            }
                            setMemory({
                                amount: parseInt(e.target.value),
                                sides: (value as DiceMemory['value']).sides,
                            })
                        }}
                        className={'w-20'}
                    />
                    <Input
                        type={'number'}
                        value={(value as DiceMemory['value']).sides}
                        onChange={(e) => {
                            if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
                                setMemory({
                                    amount: (value as DiceMemory['value']).amount,
                                    sides: 0,
                                })
                                return
                            }
                            setMemory({
                                amount: (value as DiceMemory['value']).amount,
                                sides: parseInt(e.target.value),
                            })
                        }}
                        className={'w-20'}
                    />
                </div>
            )
        case 'string':
            return (
                <Input
                    type={'text'}
                    value={value as string}
                    onChange={(e) => {
                        setMemory(e.target.value)
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
                        setMemory(parseInt(e.target.value))
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
                        setMemory(e.target.checked)
                    }}
                />
            )
        case 'component_id':
            return (
                <Input
                    type={'text'}
                    value={value as string}
                    onChange={(e) => {
                        setMemory(e.target.value)
                    }}
                    className={'w-full'}
                />
            )
        default:
            return null
    }
}
export const MemoriesEditor: React.FC<ComponentPartEditorProps> = ({ component, changeComponentField }) => {
    const { t } = useTranslation()
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
            {Object.entries(component.memory).map(([memory_key, memory], index) => {
                return (
                    <div key={index}>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className={'cursor-default text-t-smaller font-bold'}>
                                    {capitalizeFirstLetter(t(memory.display_name))}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {memory_key}
                                {memory.internal ? ' (internal)' : ''}
                            </TooltipContent>
                        </Tooltip>
                        <IndividualMemoryEditor memory_key={memory_key} memory={memory} change={changeMemory} />
                    </div>
                )
            })}
        </div>
    )
}
