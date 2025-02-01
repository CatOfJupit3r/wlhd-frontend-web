import { GameTags } from '@models/CombatEditorModels';
import { OneOf } from '@models/OneOf';

export interface GameComponentDecoration {
    name: string;
    sprite: string;
    description: string;
}

export interface Battlefield {
    pawns: {
        [key: string]: {
            character: CharacterInfoTooltip | null;
            areaEffects: Array<unknown>;
        };
    };
}

export type TranslatableString =
    | { key: string }
    | {
          key: string;
          args: {
              [key: string]: string | TranslatableString;
          };
      };

export type GameMessage = Array<TranslatableString>;
export type GameStateContainer = Array<GameMessage>;

export interface GameHandshake {
    roundCount: number;
    messages: GameStateContainer; // but only last 10 instead of all
    combatStatus: 'ongoing' | 'pending';
    currentBattlefield: Battlefield;
    controlledCharacters: Array<CharacterInfoFull> | null;
    turnOrder: IndividualTurnOrder;
    gameLobbyState: iGameLobbyState;
    actionTimestamp: number | null;
}

export type IndividualTurnOrder = Array<CharacterInTurnOrder | null>;

export interface CharacterInTurnOrder {
    controlledByYou: boolean;
    descriptor: string;
    decorations: {
        name: string;
        description: string;
        sprite: string;
    };
    square: {
        line: number;
        column: number;
    } | null;
    id_: string;
}

export interface CharacterInfoTooltip {
    decorations: GameComponentDecoration;
    square: { line: number; column: number };
    health: { current: number; max: number };
    action_points: { current: number; max: number };
    armor: { current: number; base: number };
    statusEffects: Array<StatusEffectInfo>;
}

export interface CharacterInfoFull {
    decorations: GameComponentDecoration;
    square: { line: number; column: number } | null;
    attributes: AttributeInfo;

    inventory: Array<ItemInfo>;
    weaponry: Array<WeaponInfo>;
    spellBook: {
        knownSpells: Array<SpellInfo>;
        maxActiveSpells: number | null;
    };
    statusEffects: Array<StatusEffectInfo>;
    tags: GameTags;
    memory: GameComponentMemory | null;
}

export interface CharacterAttributes {
    [attribute: string]: number;
}

export interface CommonGameComponentInfoFields {
    decorations: GameComponentDecoration;
    memory: GameComponentMemory | null;
    tags: GameTags;
}

export interface AttributeInfo {
    [attribute: string]: number;
}

export interface WeaponInfo extends CommonGameComponentInfoFields {
    descriptor: string;
    cost: number | null;
    uses: {
        current: number;
        max: number | null;
    };
    consumable: boolean;
    quantity: number;
    userNeedsRange: Array<number>;
    cooldown: { current: number; max: number | null };
    isActive: boolean;
}

export interface ItemInfo extends CommonGameComponentInfoFields {
    descriptor: string;
    cost: number | null;
    uses: {
        current: number;
        max: number | null;
    };
    userNeedsRange: Array<number>;
    cooldown: { current: number; max: number | null };
    quantity: number; // how many of given item character has
    consumable: boolean; // if item is consumable
}

export interface SpellInfo extends CommonGameComponentInfoFields {
    descriptor: string;
    cost: number | null;
    userNeedsRange: Array<number>;
    uses: {
        current: number;
        max: number | null;
    };
    cooldown: { current: number; max: number | null };
    isActive: boolean;
}

export interface StatusEffectInfo extends CommonGameComponentInfoFields {
    descriptor: string;
    duration: number | null;
}

export interface iActionDecoration extends GameComponentDecoration {
    cost: string;
    memories: GameComponentMemory;
}

export interface iAction {
    id: string;
    decorations: iActionDecoration;
    available: boolean;
    requires: null | {
        [argument: keyof iCharacterActions]: string;
    };
}

export interface iCharacterActions {
    [key: string]: Array<iAction>;
}

export interface MemoryType {
    type: string;
    value: unknown;
    display_name: string;
    display_value: string;
    internal: boolean;
}

export interface DiceMemory extends MemoryType {
    type: 'dice';
    value: {
        sides: number;
        amount: number;
    };
}

export interface StringMemory extends MemoryType {
    type: 'string';
    value: string;
}

export interface ComponentIDMemory extends MemoryType {
    type: 'component_id';
    value: string;
}

export interface ElementOfHpChangeMemory extends MemoryType {
    type: 'element_of_hp_change';
    value: string;
}

export interface TypeOfHpChangeMemory extends MemoryType {
    type: 'type_of_hp_change';
    value: 'heal' | 'damage';
}

export interface StateMemory extends MemoryType {
    type: 'state';
    value: string;
}

export interface StateChangeModeMemory extends MemoryType {
    type: 'state_change_mode';
    value: '+' | '-';
}

export interface NumberMemory extends MemoryType {
    type: 'number';
    value: number;
}

interface BooleanMemory extends MemoryType {
    type: 'boolean';
    value: boolean;
}

export type PossibleMemory = OneOf<
    [
        DiceMemory,
        StringMemory,
        NumberMemory,
        BooleanMemory,
        ComponentIDMemory,
        MemoryType,
        ElementOfHpChangeMemory,
        TypeOfHpChangeMemory,
        StateMemory,
        StateChangeModeMemory,
    ]
>;

export interface GameComponentMemory {
    [variable: string]: PossibleMemory;
}

export interface iGameLobbyState {
    players: Array<{
        userId: string;
        isGm: boolean;
        isConnected: boolean;
    }>;
}
