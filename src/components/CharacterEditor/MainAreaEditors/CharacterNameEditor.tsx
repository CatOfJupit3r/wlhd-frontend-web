import CharacterLimit from '@components/CharacterEditor/MainAreaEditors/CharacterLimit';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { useCharacterEditorContext } from '@context/CharacterEditorProvider';
import React from 'react';
import { RxReset } from 'react-icons/rx';

const MAX_NAME_LENGTH = 64;

const CharacterNameEditor = () => {
    const { character, updateCharacter, initial } = useCharacterEditorContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_NAME_LENGTH) {
            updateCharacter({
                ...character,
                decorations: {
                    ...character.decorations,
                    name: value,
                },
            });
        }
    };

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
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => {
                        updateCharacter({
                            ...character,
                            decorations: {
                                ...character.decorations,
                                name: initial.decorations.name,
                            },
                        });
                    }}
                    className={'h-5 text-gray-400 hover:text-gray-600'}
                >
                    <RxReset />
                </Button>
            </div>
        </div>
    );
};

export default CharacterNameEditor;
