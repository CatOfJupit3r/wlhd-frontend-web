import {
    AreaEffectEditable,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@type-defs/combat-editor-models';

import ComponentEditorFactory from './component-editor-factory';

export const ItemEditor = ComponentEditorFactory<ItemEditable>('item');
export const WeaponEditor = ComponentEditorFactory<WeaponEditable>('weapon');
export const SpellEditor = ComponentEditorFactory<SpellEditable>('spell');
export const StatusEffectEditor = ComponentEditorFactory<StatusEffectEditable>('statusEffect');
export const AreaEffectEditor = ComponentEditorFactory<AreaEffectEditable>('areaEffect');
