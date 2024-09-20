import { ItemEditable, SpellEditable, StatusEffectEditable, WeaponEditable } from '@models/CombatEditorModels'
import React from 'react'

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

const ComponentEditorFactory = <T extends { [key: string]: any }>(type: string, displayName: string) => {
    const created = ({
        component,
        setComponent,
        mode,
    }: {
        component: T
        setComponent: (component: T) => void
        mode: 'preset' | 'save'
    }) => {
        /*
        Items[preset] = ['quantity', 'currentConsecutiveUses', 'turnsUntilUsage']
        Weapons[preset] = ['quantity', 'currentConsecutiveUses', 'turnsUntilUsage', 'isActive']
        Spells[preset] = ['currentConsecutiveUses', 'turnsUntilUsage', 'isActive']
        StatusEffects[preset] = ['duration']
        
        
        This component mimics the view of InfoDisplay. However, it is used to edit the values of the components.

         */
        return <div className={'border-2'}>Hello from {type} ComponentEditor!</div>
    }
    created.displayName = displayName
    return created
}

const ItemEditor = ComponentEditorFactory<ItemEditable>('item', 'ItemEditor')
const WeaponEditor = ComponentEditorFactory<WeaponEditable>('weapon', 'WeaponEditor')
const SpellEditor = ComponentEditorFactory<SpellEditable>('spell', 'SpellEditor')
const StatusEffectEditor = ComponentEditorFactory<StatusEffectEditable>('statusEffect', 'StatusEffectEditor')

export { ItemEditor, WeaponEditor, SpellEditor, StatusEffectEditor }
