import { CharacterDataEditable, CharacterDataInPreset, CharacterDataInSave } from '@models/CombatEditorModels'
import { EntityInfoFull } from '@models/GameModels'

class GameConverters {
    public convertEditableToInfoFull = (character: CharacterDataEditable): EntityInfoFull => {
        return {
            decorations: character.decorations,
            square: null,
            attributes: character.attributes,

            spellBook: {
                maxActiveSpells: character.spellBook.maxActiveSpells,
                knownSpells: character.spellBook.knownSpells.map((spell) => ({
                    descriptor: spell.descriptor,
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
                })),
            },
            inventory: character.inventory.map((item) => ({
                descriptor: item.descriptor,
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
            })),
            statusEffects: character.statusEffects.map((effect) => ({
                descriptor: effect.descriptor,
                decorations: effect.decorations,
                duration: effect.duration,
                memory: effect.memory,
                tags: effect.tags,
            })),
            weaponry: character.weaponry.map((weapon) => ({
                descriptor: weapon.descriptor,
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
                    resetOnCooldownUpdate: weapon.consecutiveUseResetOnCooldownUpdate,
                },
                isActive: weapon.isActive,
                userNeedsRange: weapon.casterMustBeInRange,
                tags: weapon.tags,
                memory: weapon.memory,
            })),
            tags: [],
            memory: {},
        }
    }

    /*
    snippet for decoration handling:

    decorations: descriptor.startsWith('coordinator:')
    ? {
          name: `${descriptor}.name`,
          description: `${descriptor}.description`,
          sprite: isDescriptor(character.decorations.sprite)
              ? character.decorations.sprite
              : `coordinator:${character.decorations.sprite}`,
      }
    : character.decorations,
     */

    public convertEditableToInSave = (_character: CharacterDataEditable): CharacterDataInSave => {
        // TODO: implement
        return {} as CharacterDataInSave
    }
    public convertEditableToInPreset = (_character: CharacterDataEditable): CharacterDataInPreset => {
        // TODO: implement
        return {} as CharacterDataInPreset
    }
}

export default new GameConverters()
