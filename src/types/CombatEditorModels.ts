import { ControlledBy } from '@type-defs/EditorConversion';
import { GameComponentDecoration, GameComponentMemory } from '@type-defs/GameModels';

/*

`Editable` models are supplied by backend and are full representations of the data that can be edited in the combat editor.

 */

interface CommonEditableField {
    descriptor: string;
    decorations: GameComponentDecoration;
    memory: GameComponentMemory | null;
    tags: GameTags;
}

interface UsableComponentEditableFields extends CommonEditableField {
    usageCost: number | null;
    turnsUntilUsage: number;
    cooldownValue: number | null;
    currentConsecutiveUses: number;
    maxConsecutiveUses: number | null;
    consecutiveUsesResetOnCooldownUpdate: boolean;
    casterMustBeInRange: Array<number>;

    requirements: unknown; // for now unknown
}

export interface ItemEditable extends UsableComponentEditableFields {
    quantity: number;
    isConsumable: boolean;
}

export interface WeaponEditable extends ItemEditable {
    isActive: boolean;
    costToSwitch: number;
}

export interface StatusEffectEditable extends CommonEditableField {
    duration: number | null;
    static: boolean;

    autoMessages: boolean;
    isVisible: boolean;
    activatesOnApply: boolean;

    owner: null | unknown; // character, but unknown for now
    updateType: string;
    activationType: string;
}

export interface AreaEffectEditable extends StatusEffectEditable {
    squares: string[];
}

export interface SpellEditable extends UsableComponentEditableFields {
    isActive: boolean;
}

export type InventoryEditable = Array<ItemEditable & { descriptor: string }>;
export type WeaponryEditable = Array<WeaponEditable & { isActive: boolean; descriptor: string }>;
export type SpellBookEditable = {
    knownSpells: Array<SpellEditable & { isActive: boolean; descriptor: string }>;
    maxActiveSpells: number | null;
};
export type StatusEffectsEditable = Array<StatusEffectEditable & { descriptor: string }>;
export type AreaEffectsOnBattlefieldEditable = Array<AreaEffectEditable & { descriptor: string }>;

export type CharacterDataEditable = {
    descriptor: string;
    square?: { line: number; column: number } | null;
    inventory: InventoryEditable;
    weaponry: WeaponryEditable;
    spellBook: SpellBookEditable;
    statusEffects: StatusEffectsEditable;

    attributes: { [attribute: string]: number };

    states: { [state: string]: number };
    addedCosts: { [cost: string]: number };

    decorations: GameComponentDecoration;
    tags: GameTags;
    memory: GameComponentMemory | null;
    id_: string;
};

export interface CharacterDataEditableInCombat extends CharacterDataEditable {
    controlInfo: ControlledBy;
    square: { line: number; column: number } | null;
}

/*

`InPreset` and `InSave` are cleaned up versions of `Editable` models.
They are exclusive to combat creation and no component directly interacts with them.

 */

interface CommonPresetFields {
    descriptor: string;
    currentConsecutiveUses: number;
    turnsUntilUsage: number;
}

export interface ItemInPreset extends CommonPresetFields {
    quantity: number;
    isConsumable: boolean;
}

export interface WeaponInPreset extends ItemInPreset {
    costToSwitch: number;
    isActive: boolean;
}

export interface StatusEffectInPreset extends CommonPresetFields {
    duration: number | null;
    owner: null | unknown;
}

export interface SpellInPreset extends CommonPresetFields {
    isActive: boolean;
}

export type InventoryInPreset = Array<ItemInPreset>;
export type WeaponryInPreset = Array<WeaponInPreset>;
export type SpellBookInPreset = {
    knownSpells: Array<SpellInPreset>;
    maxActiveSpells: number | null;
};
export type StatusEffectsInPreset = Array<StatusEffectInPreset>;
export type GameTags = Array<string>;
export interface CharacterDataInPreset {
    inventory: InventoryInPreset;
    weaponry: WeaponryInPreset;
    spellBook: SpellBookInPreset;
    statusEffects: StatusEffectsInPreset;

    attributes: { [attribute: string]: number };

    states: { [state: string]: number };
    addedCosts: { [cost: string]: number };

    decorations: GameComponentDecoration;
    tags: GameTags;
    memory: GameComponentMemory | null;
    id?: string;
}

interface CommonSaveField {
    descriptor: string;
}

type ItemInSave = Partial<ItemEditable> & CommonSaveField & { effectHook?: string };
type WeaponInSave = Partial<WeaponEditable> & CommonSaveField & { isActive: boolean; effectHook?: string };
type StatusEffectInSave = Partial<StatusEffectEditable> & CommonSaveField;
type AreaEffectInSave = Partial<AreaEffectEditable> & CommonSaveField;
type SpellInSave = Partial<SpellEditable> & CommonSaveField & { isActive: boolean; effectHook?: string };

export type InventoryInSave = Array<ItemInSave>;
export type WeaponryInSave = Array<WeaponInSave>;
export type SpellBookInSave = {
    knownSpells: Array<SpellInSave>;
    maxActiveSpells: number | null;
};
export type StatusEffectsInSave = Array<StatusEffectInSave>;
export type AreaEffectsOnBattlefieldInSave = Array<AreaEffectInSave>;

export interface CharacterDataInSave {
    inventory: InventoryInSave;
    weaponry: WeaponryInSave;
    spellBook: SpellBookInSave;
    statusEffects: StatusEffectsInSave;

    attributes: { [attribute: string]: number };

    states: { [state: string]: number };
    addedCosts: { [cost: string]: number };

    decorations: GameComponentDecoration;
    tags: GameTags;
    memory: GameComponentMemory | null;
    id_?: string;
}
