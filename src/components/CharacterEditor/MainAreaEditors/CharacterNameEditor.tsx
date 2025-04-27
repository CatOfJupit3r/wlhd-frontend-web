import { useCharacterEditor, useCharacterEditorUpdateActions } from '@context/character-editor';
import React, { useCallback } from 'react';

import CharacterLimit from '@components/CharacterEditor/MainAreaEditors/CharacterLimit';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';

const MAX_NAME_LENGTH = 64;

const CharacterNameEditor = () => {
    const { character } = useCharacterEditor();
    const { updateCharacterDecorations } = useCharacterEditorUpdateActions();

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value.length <= MAX_NAME_LENGTH) {
                updateCharacterDecorations({
                    name: value,
                });
            }
        },
        [updateCharacterDecorations],
    );

    return (
        <div>
            <div className={'my-2 flex items-end justify-between'}>
                <Label>Character name</Label>
            </div>
            <Input
                placeholder={'Character name'}
                value={character.decorations.name}
                onChange={handleChange}
                className={'text-ellipsis text-xl font-bold'}
            />
            <div className={'mt-1 flex justify-between'}>
                <CharacterLimit characterLimit={MAX_NAME_LENGTH} text={character.decorations.name} />
            </div>
        </div>
    );
};

export default CharacterNameEditor;
