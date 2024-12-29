import { CharacterDataInSave } from '@models/CombatEditorModels'
import { CharacterClassConversion, MinifiedCombatPreset } from '@models/EditorConversion'
import { CharacterInfoFull } from '@models/GameModels'
import { isDescriptor } from '@utils/descriptorTools'

export const prepareCharacterToClassConversion = (character: CharacterDataInSave): CharacterClassConversion => {
    return {
        decorations: character.decorations,
        attributes: character.attributes,
        spellBook: {
            maxActiveSpells: character.spellBook.maxActiveSpells,
            knownSpells: character.spellBook.knownSpells.map((spell) => ({
                descriptor: spell.descriptor,
                isActive: spell.isActive,
            })),
        },
        inventory: character.inventory.map((item) => ({
            descriptor: item.descriptor,
            quantity: item.quantity,
        })),
        statusEffects: character.statusEffects.map((effect) => ({
            descriptor: effect.descriptor,
            duration: effect.duration,
        })),
        weaponry: character.weaponry.map((weapon) => ({
            descriptor: weapon.descriptor,
            quantity: weapon.quantity,
        })),
    } as CharacterClassConversion
}

export const minifyCharacter = (
    character: CharacterInfoFull,
    descriptor: string
): MinifiedCombatPreset['battlefield'][string]['character'] => {
    return {
        decorations: descriptor.startsWith('coordinator:')
            ? {
                  name: `${descriptor}.name`,
                  description: `${descriptor}.description`,
                  sprite: isDescriptor(character.decorations.sprite)
                      ? character.decorations.sprite
                      : `coordinator:${character.decorations.sprite}`,
              }
            : character.decorations,
        attributes: character.attributes,
        spellBook: {
            maxActiveSpells: character.spellBook.maxActiveSpells,
            knownSpells: character.spellBook.knownSpells.map((spell) => ({
                descriptor: spell.descriptor,
                is_active: spell.isActive ?? false,
                turns_until_usage: spell.cooldown.current,
                current_consecutive_uses: spell.uses.current,
            })),
        },
        inventory: character.inventory.map((item) => ({
            descriptor: item.descriptor,
            quantity: item.quantity,
            turns_until_usage: item.cooldown.current,
            current_consecutive_uses: item.uses.current,
        })),
        statusEffects: character.statusEffects.map((effect) => ({
            descriptor: effect.descriptor,
            duration: effect.duration,
        })),
        weaponry: character.weaponry.map((weapon) => ({
            descriptor: weapon.descriptor,
            quantity: weapon.quantity,
            turns_until_usage: weapon.cooldown.current,
            current_consecutive_uses: weapon.uses.current,
            is_active: weapon.isActive,
        })),
    }
}
