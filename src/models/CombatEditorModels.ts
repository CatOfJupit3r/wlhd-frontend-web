import { GameComponentDecoration, GameComponentMemory } from '@models/GameModels'

/*

`Editable` models are supplied by backend and are full representations of the data that can be edited in the combat editor.

 */

interface CommonEditableField {
    decorations: GameComponentDecoration
    memory: GameComponentMemory
    tags: Array<string>
}

interface UsableComponentEditableFields extends CommonEditableField {
    usageCost: number | null
    turnsUntilUsage: number
    cooldownValue: number | null
    currentConsecutiveUses: number
    maxConsecutiveUses: number | null
    consecutiveUseResetOnCooldownUpdate: boolean
    casterMustBeInRange: Array<number>

    requirements: unknown // for now unknown
}

export interface ItemEditable extends UsableComponentEditableFields {
    applies: Array<string>
    quantity: number
    isConsumable: boolean
}

export interface WeaponEditable extends ItemEditable {
    costToSwitch: number
}

export interface StatusEffectEditable extends CommonEditableField {
    duration: number | null
    static: boolean

    autoMessages: boolean
    isVisible: boolean
    activatesOnApply: boolean

    owner: null | unknown // entity, but unknown for now
    updateType: string
    activationType: string
}

export interface SpellEditable extends UsableComponentEditableFields {}

export type InventoryEditable = Array<ItemEditable & { descriptor: string }>
export type WeaponryEditable = Array<WeaponEditable & { isActive: boolean; descriptor: string }>
export type SpellBookEditable = {
    knownSpells: Array<SpellEditable & { isActive: boolean; descriptor: string }>
    maxActiveSpells: number | null
}
export type StatusEffectsEditable = Array<StatusEffectEditable & { descriptor: string }>

export type CharacterDataEditable = {
    inventory: InventoryEditable
    weaponry: WeaponryEditable
    spellBook: SpellBookEditable
    statusEffects: StatusEffectsEditable

    attributes: { [attribute: string]: number }

    states: { [state: string]: number }
    addedCosts: { [cost: string]: number }

    decorations: GameComponentDecoration
    tags: Array<string>
    memory: GameComponentMemory
    id_?: string
}

/*

`InPreset` and `InSave` are cleaned up versions of `Editable` models.
They are exclusive to combat creation and no component directly interacts with them.

 */

interface CommonPresetFields {
    descriptor: string
    currentConsecutiveUses: number
    turnsUntilUsage: number
}

export interface ItemInPreset extends CommonPresetFields {
    quantity: number
    isConsumable: boolean
}

export interface WeaponInPreset extends ItemInPreset {
    costToSwitch: number
    isActive: boolean
}

export interface StatusEffectInPreset extends CommonPresetFields {
    duration: number | null
    owner: null | unknown
}

export interface SpellInPreset extends CommonPresetFields {
    isActive: boolean
}

export type InventoryInPreset = Array<ItemInPreset>
export type WeaponryInPreset = Array<WeaponInPreset>
export type SpellBookInPreset = {
    knownSpells: Array<SpellInPreset>
    maxActiveSpells: number | null
}
export type StatusEffectsInPreset = Array<StatusEffectInPreset>

export interface CharacterDataInPreset {
    inventory: InventoryInPreset
    weaponry: WeaponryInPreset
    spellBook: SpellBookInPreset
    statusEffects: StatusEffectsInPreset

    attributes: { [attribute: string]: number }

    states: { [state: string]: number }
    addedCosts: { [cost: string]: number }

    decorations: GameComponentDecoration
    tags: Array<string>
    memory: GameComponentMemory
    id?: string
}

interface CommonSaveField {
    descriptor: string
}

type ItemInSave = Partial<ItemEditable> & CommonSaveField & { effectHook?: string }
type WeaponInSave = Partial<WeaponEditable> & CommonSaveField & { isActive: boolean; effectHook?: string }
type StatusEffectInSave = Partial<StatusEffectEditable> & CommonSaveField
type SpellInSave = Partial<SpellEditable> & CommonSaveField & { isActive: boolean; effectHook?: string }

export type InventoryInSave = Array<ItemInSave>
export type WeaponryInSave = Array<WeaponInSave>
export type SpellBookInSave = {
    knownSpells: Array<SpellInSave>
    maxActiveSpells: number | null
}
export type StatusEffectsInSave = Array<StatusEffectInSave>

export interface CharacterDataInSave {
    inventory: InventoryInSave
    weaponry: WeaponryInSave
    spellBook: SpellBookInSave
    statusEffects: StatusEffectsInSave

    attributes: { [attribute: string]: number }

    states: { [state: string]: number }
    addedCosts: { [cost: string]: number }

    decorations: GameComponentDecoration
    tags: Array<string>
    memory: GameComponentMemory
    id_?: string
}