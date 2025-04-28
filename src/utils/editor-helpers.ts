import { CombatEditorSaveType } from '@context/combat-editor';
import { CharacterDataInSave } from '@type-defs/CombatEditorModels';
import {
    CharacterClassConversion,
    ControlledBy,
    ControlledByAI,
    ControlledByGameLogic,
    ControlledByPlayer,
    CreateCombatBody,
    MinifiedCombatPreset,
} from '@type-defs/EditorConversion';
import { CharacterInfoFull } from '@type-defs/GameModels';

import { isDescriptor, isValidSquareString } from '@utils/game-helpers';

export const CONTROLLED_BY_PLAYER = (id: string): ControlledByPlayer => ({ type: 'player', id });
export const CONTROLLED_BY_AI = (id: string): ControlledByAI => ({ type: 'ai', id });
export const CONTROLLED_BY_GAME_LOGIC = (): ControlledByGameLogic => ({ type: 'game_logic' });

class EditorHelpers {
    private processControl(control: unknown): ControlledBy {
        if (typeof control !== 'object' || control === null) {
            return CONTROLLED_BY_GAME_LOGIC();
        }
        if ('type' in control && 'id' in control) {
            if (control.type === 'player' || control.type === 'ai') {
                if (typeof control.id !== 'string' && control.id !== null) {
                    return CONTROLLED_BY_GAME_LOGIC();
                }
                return control as ControlledBy;
            }
            return CONTROLLED_BY_GAME_LOGIC();
        }
        return CONTROLLED_BY_GAME_LOGIC();
    }

    private convertTurnOrderToExportable(editorSave: CombatEditorSaveType): CreateCombatBody['preset']['turnOrder'] {
        const { turnOrder, activeCharacterIndex } = editorSave;
        const turnOrderCopy = [...turnOrder];
        // [1, 2, 3, 4, 5]. 2 is activeCharacterIndex
        // [3, 4, 5, null, 1, 2]

        const firstHalf = turnOrderCopy.slice(activeCharacterIndex + 1).map((turn) => turn.character);
        const secondHalf = turnOrderCopy.slice(0, activeCharacterIndex + 1).map((turn) => turn.character);

        // null is the round end. it is possible for multiple nulls, but editor is not designed for that
        console.log('First half:', firstHalf);
        console.log('Second half:', secondHalf);
        console.log('Merge:', [...firstHalf, null, ...secondHalf]);
        return [...firstHalf, null, ...secondHalf];
    }

    private convertSquareToExportable(
        editorSave: CombatEditorSaveType,
        square: string,
    ): CreateCombatBody['preset']['battlefield'][string] {
        const { battlefield } = editorSave;
        const data = battlefield[square];
        const { square: _, controlInfo, ...source } = data;
        if (source === null) {
            throw new Error('Character is null');
        }
        const control = this.processControl(controlInfo);
        console.log('Source:', source);
        return {
            descriptor: data.descriptor,
            source,
            control,
        };
    }

    private convertBattlefieldToExportable(
        editorSave: CombatEditorSaveType,
    ): CreateCombatBody['preset']['battlefield'] {
        const converted: CreateCombatBody['preset']['battlefield'] = {};
        for (const square in editorSave.battlefield) {
            const [line, column] = square.split(',').map((x) => parseInt(x));
            if (line < 1 || line > 6 || column < 1 || column > 6) {
                continue;
            }
            converted[square] = this.convertSquareToExportable(editorSave, square);
        }
        return converted;
    }

    public convertAreaEffectsToExportable(editorSave: CombatEditorSaveType): CreateCombatBody['preset']['areaEffects'] {
        return editorSave.areaEffects
            .filter((effect) => effect.descriptor !== '')
            .map((effect) => {
                return {
                    ...effect,
                    squares: effect.squares.filter((square) => isValidSquareString(square)),
                };
            })
            .filter((effect) => effect.squares.length > 0);
    }

    public convertGameEditorSaveToExportable(editorSave: CombatEditorSaveType): CreateCombatBody['preset'] {
        return {
            round: editorSave.round,
            turnOrder: this.convertTurnOrderToExportable(editorSave),
            messages: editorSave.messages,
            battlefield: this.convertBattlefieldToExportable(editorSave),
            areaEffects: this.convertAreaEffectsToExportable(editorSave),
        };
    }

    public prepareCharacterToClassConversion = (character: CharacterDataInSave): CharacterClassConversion => {
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
        } as CharacterClassConversion;
    };

    public minifyCharacter = (
        character: CharacterInfoFull,
        descriptor: string,
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
        };
    };
}

export default new EditorHelpers();
