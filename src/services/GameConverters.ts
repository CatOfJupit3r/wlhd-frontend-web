import {
    AreaEffectEditable,
    CharacterDataEditable,
    CharacterDataInPreset,
    CharacterDataInSave,
    ItemEditable,
    SpellEditable,
    StatusEffectEditable,
    WeaponEditable,
} from '@models/CombatEditorModels';
import {
    AreaEffectInfo,
    CharacterInfoFull,
    ItemInfo,
    SpellInfo,
    StatusEffectInfo,
    WeaponInfo,
} from '@models/GameModels';

class GameConverters {
    public convertSpellEditableToInfo = (descriptor: string, spell: SpellEditable): SpellInfo => {
        return {
            descriptor,
            decorations: spell.decorations,
            userNeedsRange: spell.casterMustBeInRange,
            isActive: spell.isActive,
            cost: spell.usageCost,
            cooldown: {
                current: spell.turnsUntilUsage,
                max: spell.cooldownValue,
            },
            uses: {
                current: spell.currentConsecutiveUses,
                max: spell.maxConsecutiveUses,
            },
            memory: spell.memory,
            tags: spell.tags,
        };
    };

    public convertItemEditableToInfo = (descriptor: string, item: ItemEditable): ItemInfo => {
        return {
            descriptor,
            decorations: item.decorations,
            quantity: item.quantity,
            consumable: item.isConsumable,
            cost: item.usageCost,
            cooldown: {
                current: item.turnsUntilUsage,
                max: item.cooldownValue,
            },
            uses: {
                current: item.currentConsecutiveUses,
                max: item.maxConsecutiveUses,
            },
            userNeedsRange: item.casterMustBeInRange,
            tags: item.tags,
            memory: item.memory,
        };
    };

    public convertWeaponEditableToInfo = (descriptor: string, weapon: WeaponEditable): WeaponInfo => {
        return {
            descriptor,
            decorations: weapon.decorations,
            quantity: weapon.quantity,
            consumable: weapon.isConsumable,
            cost: weapon.usageCost,
            cooldown: {
                current: weapon.turnsUntilUsage,
                max: weapon.cooldownValue,
            },
            uses: {
                current: weapon.currentConsecutiveUses,
                max: weapon.maxConsecutiveUses,
                // resetOnCooldownUpdate: weapon.consecutiveUseResetOnCooldownUpdate,
            },
            isActive: weapon.isActive,
            userNeedsRange: weapon.casterMustBeInRange,
            tags: weapon.tags,
            memory: weapon.memory,
        };
    };

    public convertStatusEffectEditableToInfo = (descriptor: string, effect: StatusEffectEditable): StatusEffectInfo => {
        return {
            descriptor,
            decorations: effect.decorations,
            duration: effect.duration,
            memory: effect.memory,
            tags: effect.tags,
        };
    };

    public convertCharacterEditableToInfoFull = (character: CharacterDataEditable): CharacterInfoFull => {
        return {
            decorations: character.decorations,
            square: null,
            attributes: character.attributes,

            spellBook: {
                maxActiveSpells: character.spellBook.maxActiveSpells,
                knownSpells: character.spellBook.knownSpells.map((spell) =>
                    this.convertSpellEditableToInfo(spell.descriptor, spell),
                ),
            },
            inventory: character.inventory.map((item) => this.convertItemEditableToInfo(item.descriptor, item)),
            statusEffects: character.statusEffects.map((effect) =>
                this.convertStatusEffectEditableToInfo(effect.descriptor, effect),
            ),
            weaponry: character.weaponry.map((weapon) => this.convertWeaponEditableToInfo(weapon.descriptor, weapon)),
            tags: [],
            memory: {},
        };
    };

    public convertAreaEffectEditableToInfo = (descriptor: string, effect: AreaEffectEditable): AreaEffectInfo => {
        return {
            descriptor,
            duration: effect.duration,
            squares: effect.squares,
            memory: effect.memory,
            tags: effect.tags,
            decorations: effect.decorations,
        };
    };

    public convertEditableToInSave = (_character: CharacterDataEditable): CharacterDataInSave => {
        // TODO: implement
        return {} as CharacterDataInSave;
    };
    public convertEditableToInPreset = (_character: CharacterDataEditable): CharacterDataInPreset => {
        // TODO: implement
        return {} as CharacterDataInPreset;
    };
}

export default new GameConverters();
