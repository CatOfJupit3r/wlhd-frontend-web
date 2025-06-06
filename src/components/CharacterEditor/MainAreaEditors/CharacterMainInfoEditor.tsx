import { useCharacterEditor } from '@context/character-editor';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPencil } from 'react-icons/lu';

import CharacterBasicInfo from '@components/CharacterDisplay/CharacterBasicInfo';
import CharacterDescriptionEditor from '@components/CharacterEditor/MainAreaEditors/CharacterDescriptionEditor';
import CharacterNameEditor from '@components/CharacterEditor/MainAreaEditors/CharacterNameEditor';
import CharacterSpriteEditor from '@components/CharacterEditor/MainAreaEditors/CharacterSpriteEditor';
import { Button } from '@components/ui/button';

const CharacterMainInfoEditor = () => {
    const { flags, character } = useCharacterEditor();
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    });
    const [editing, setEditing] = React.useState(false);

    const EditCharacterButton = useMemo(
        () => (
            <Button
                variant={'ghost'}
                size={'icon'}
                onClick={() => {
                    setEditing(!editing);
                }}
                title={editing ? t('stop-editing') : t('edit-character')}
                className={'absolute right-0 top-0 size-8 opacity-50 transition-all hover:opacity-100'}
            >
                <LuPencil />
            </Button>
        ),
        [editing],
    );

    return flags.exclude?.name && flags.exclude?.description && flags.exclude?.sprite ? (
        <CharacterBasicInfo
            includeSquare={false}
            character={{
                name: character.decorations.name,
                sprite: character.decorations.sprite,
                description: character.decorations.description,
                square: character?.square ?? null,
            }}
        />
    ) : editing ? (
        <div className={'relative flex flex-row gap-4'}>
            {EditCharacterButton}
            <CharacterSpriteEditor />
            <div className={'flex flex-col gap-2'}>
                <CharacterNameEditor />
                <CharacterDescriptionEditor />
            </div>
        </div>
    ) : (
        <div className={'relative'}>
            {EditCharacterButton}
            <CharacterBasicInfo
                includeSquare={false}
                character={{
                    name: character.decorations.name,
                    sprite: character.decorations.sprite,
                    description: character.decorations.description,
                    square: character?.square ?? null,
                }}
            />
        </div>
    );
};

export default CharacterMainInfoEditor;
