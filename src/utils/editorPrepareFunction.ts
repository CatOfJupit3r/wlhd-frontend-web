import { EntityInfoFull } from '@models/Battlefield'
import { CharacterClassConversion } from '@models/EditorConversion'

export const prepareCharacterToClassConversion = (character: EntityInfoFull): CharacterClassConversion => {
    return {
        decorations: character.decorations,
        attributes: Object.entries(character.attributes).map(([descriptor, value]) => ({
            descriptor,
            value: parseInt(value),
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
