import {
    ActivenessEditor,
    AllowedEditables,
    CooldownEditor,
    CostEditor,
    DurationEditor,
    MemoriesEditor,
    QuantityEditor,
    UsesEditor,
} from '@components/CharacterEditor/GameComponentEditors/ComponentSegmentEditors'
import { Separator } from '@components/ui/separator'
import { ItemEditable, SpellEditable, StatusEffectEditable, WeaponEditable } from '@models/CombatEditorModels'
import { GameComponentMemory } from '@models/GameModels'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

type ComponentEditorProps<T extends AllowedEditables> = {
    component: T
    setComponent: (component: T) => void
    canBeActivated?: (component?: T) => boolean
}

const ComponentEditorFactory = <T extends AllowedEditables>(type: string): React.FC<ComponentEditorProps<T>> => {
    const created: React.FC<ComponentEditorProps<T>> = ({ component, setComponent, canBeActivated }) => {
        const { t } = useTranslation()

        const changeComponentField = useCallback(
            (key: string, value: number | boolean | GameComponentMemory) => {
                setComponent({
                    ...component,
                    [key]: value,
                })
            },
            [component, setComponent]
        )

        return (
            <div
                className={
                    'border-container-medium relative flex w-full max-w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-3'
                }
            >
                <div
                    id={'main-info'}
                    className={'flex w-full flex-row justify-between overflow-hidden text-t-normal font-bold'}
                >
                    <div className={'flex flex-row items-center gap-2'}>
                        {t(component.decorations?.name) ?? '???'}
                        {type === 'weapon' || type === 'spell' ? (
                            <ActivenessEditor
                                component={component}
                                changeComponentField={changeComponentField}
                                disabled={canBeActivated ? !canBeActivated(component) : true}
                            />
                        ) : null}
                    </div>
                </div>
                <Separator />
                <div id={'minor-info'} className={'flex flex-row justify-between text-t-small'}>
                    <div className={'flex flex-col gap-3'}>
                        {type === 'item' || type === 'weapon' ? (
                            <QuantityEditor component={component} changeComponentField={changeComponentField} />
                        ) : null}
                        {type === 'item' || type === 'weapon' || type === 'spell' ? (
                            <UsesEditor component={component} changeComponentField={changeComponentField} />
                        ) : null}
                    </div>
                    <div id={'type-details'} className={'flex flex-col items-end gap-3'}>
                        {type === 'statusEffect' ? (
                            <DurationEditor component={component} changeComponentField={changeComponentField} />
                        ) : (
                            <>
                                <CooldownEditor component={component} changeComponentField={changeComponentField} />
                                <CostEditor component={component} changeComponentField={changeComponentField} />
                            </>
                        )}
                    </div>
                </div>
                <Separator />
                <div id={'description'} className={'break-words text-t-smaller italic text-gray-400'}>
                    {t(component.decorations?.description) ?? '???'}
                </div>
                <Separator />
                <MemoriesEditor component={component} changeComponentField={changeComponentField} />
            </div>
        )
    }
    return created
}

const ItemEditor = ComponentEditorFactory<ItemEditable>('item')
ItemEditor.displayName = 'ItemEditor'

const WeaponEditor = ComponentEditorFactory<WeaponEditable>('weapon')
WeaponEditor.displayName = 'WeaponEditor'

const SpellEditor = ComponentEditorFactory<SpellEditable>('spell')
SpellEditor.displayName = 'SpellEditor'

const StatusEffectEditor = ComponentEditorFactory<StatusEffectEditable>('statusEffect')
StatusEffectEditor.displayName = 'StatusEffectEditor'

export { ItemEditor, WeaponEditor, SpellEditor, StatusEffectEditor }
export type { ComponentEditorProps }
