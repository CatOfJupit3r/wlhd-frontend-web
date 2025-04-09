import CharacterLimit from '@components/CharacterEditor/MainAreaEditors/CharacterLimit';
import { Label } from '@components/ui/label';
import { useCharacterEditor } from '@context/character-editor';
import React, { useCallback, useEffect, useRef } from 'react';

const MAX_DESCRIPTION_LENGTH = 256;

const CharacterDescriptionEditor = () => {
    const { character, updateCharacterDecorations } = useCharacterEditor();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const setCharacterDescription = useCallback(
        (description: string) => {
            updateCharacterDecorations({
                description,
            });
        },
        [updateCharacterDecorations],
    );
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [character.decorations.description]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_DESCRIPTION_LENGTH) {
            setCharacterDescription(value);
        }
    };

    return (
        <div className={'w-full'}>
            <div className={'mb-2 flex items-end justify-between'}>
                <Label>Description</Label>
            </div>
            <textarea
                ref={textareaRef}
                value={character.decorations.description}
                onChange={handleChange}
                className={'w-full resize-none text-ellipsis rounded border p-2'}
                rows={1}
            />
            <div className={'mt-1 flex justify-between'}>
                <CharacterLimit characterLimit={MAX_DESCRIPTION_LENGTH} text={character.decorations.description} />
            </div>
        </div>
    );
};

export default CharacterDescriptionEditor;
