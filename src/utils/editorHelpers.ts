import { CombatEditorSaveType, CONTROLLED_BY_GAME_LOGIC } from '@context/CombatEditorContext';
import { ControlledBy, CreateCombatBody } from '@models/EditorConversion';

class EditorHelpers {
    private processControl(control: unknown): ControlledBy {
        if (typeof control !== 'object' || control === null) {
            return CONTROLLED_BY_GAME_LOGIC;
        }
        if ('type' in control && 'id' in control) {
            if (control.type === 'player' || control.type === 'ai') {
                if (typeof control.id !== 'string' && control.id !== null) {
                    return CONTROLLED_BY_GAME_LOGIC;
                }
                return control as ControlledBy;
            }
            return CONTROLLED_BY_GAME_LOGIC;
        }
        return CONTROLLED_BY_GAME_LOGIC;
    }

    private convertTurnOrderToExportable(editorSave: CombatEditorSaveType): CreateCombatBody['preset']['turnOrder'] {
        const { turnOrder, activeCharacterIndex } = editorSave;
        const turnOrderCopy = [...turnOrder];
        // [1, 2, 3, 4, 5]. 2 is activeCharacterIndex
        // [3, 4, 5, null, 1, 2]

        const firstHalf = turnOrderCopy.slice(activeCharacterIndex + 1);
        const secondHalf = turnOrderCopy.slice(0, activeCharacterIndex + 1);

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

    public convertGameEditorSaveToExportable(editorSave: CombatEditorSaveType): CreateCombatBody['preset'] {
        return {
            round: editorSave.round,
            turnOrder: this.convertTurnOrderToExportable(editorSave),
            messages: editorSave.messages,
            battlefield: this.convertBattlefieldToExportable(editorSave),
        };
    }
}

export default new EditorHelpers();
