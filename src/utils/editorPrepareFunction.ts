import { CombatEditorContextType } from '@components/ContextProviders/CombatEditorContext'
import { EntityInfoFull } from '@models/Battlefield'
import { CharacterClassConversion, MinifiedCombatPreset } from '@models/EditorConversion'
import { isDescriptor } from '@utils/descriptorTools'

export const prepareCharacterToClassConversion = (character: EntityInfoFull): CharacterClassConversion => {
    return {
        decorations: character.decorations,
        attributes: Object.entries(character.attributes).map(([descriptor, value]) => ({
            descriptor,
            value: value,
        })),
        spellBook: {
            maxActiveSpells: character.spellBook.maxActiveSpells,
            knownSpells: character.spellBook.spells.map((spell) => ({
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
            duration: effect.duration === null ? null : parseInt(effect.duration),
        })),
        weaponry: character.weaponry.map((weapon) => ({
            descriptor: weapon.descriptor,
            quantity: weapon.quantity,
        })),
    } as CharacterClassConversion
}

export const minifyCharacter = (
    character: EntityInfoFull,
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
            knownSpells: character.spellBook.spells.map((spell) => ({
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
            duration: effect.duration === null ? null : parseInt(effect.duration),
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

export const minifyCombat = (combat: CombatEditorContextType['battlefield']): MinifiedCombatPreset => {
    const minified: MinifiedCombatPreset = {
        nickName: 'stuff',
        battlefield: {},
    }
    const squares = Object.keys(combat)
    for (const squareKey of squares) {
        const square = combat[squareKey]
        const { descriptor, character, control } = square
        if (character) {
            minified.battlefield[squareKey] = {
                descriptor,
                character: minifyCharacter(character, descriptor),
                control: control ?? { type: 'game_logic' },
            }
            console.log(minified.battlefield[squareKey].character.spellBook.knownSpells)
        }
    }

    return minified
}
