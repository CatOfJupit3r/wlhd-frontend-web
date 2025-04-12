import { common } from '@components/editors/game-component-editors';
import { EmptyMenuContent } from '@components/ui/menu';
import { useCharacterEditor, useCharacterEditorUpdateActions } from '@context/character-editor';
import { GameComponentMemory } from '@models/GameModels';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const CharacterMiscEditor = () => {
    const { memories, character } = useCharacterEditor();
    const { changeCharacterTags, changeCharacterMemories } = useCharacterEditorUpdateActions();

    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    });

    const editMemoryCallback = useCallback(
        <T extends 'tags' | 'memory'>(
            key: T,
            value: T extends 'tags' ? string[] : T extends 'memory' ? GameComponentMemory : never,
        ) => {
            if (key === 'tags') {
                changeCharacterTags(value as string[]);
            }
            if (key === 'memory') {
                changeCharacterMemories(value as GameComponentMemory);
            }
        },
        [changeCharacterTags, changeCharacterMemories],
    );

    return (
        <div className={'flex w-full flex-col gap-2'}>
            <div className={'flex w-full flex-col justify-center gap-1 p-4'}>
                <p className={'text-center text-xl'}>{t('memories.title')}</p>
                <common.CreateNewMemoryWithAccordion component={character} changeComponentField={editMemoryCallback} />
                {memories && Object.keys(memories).length === 0 ? (
                    <EmptyMenuContent />
                ) : (
                    <common.MemoriesEditor component={character} changeComponentField={editMemoryCallback} />
                )}
            </div>
            <div className={'flex w-full flex-col justify-center gap-1 p-4'}>
                <p className={'text-center text-xl'}>{t('tags.title')}</p>
                <common.TagsEditor component={character} changeComponentField={editMemoryCallback} />
            </div>
        </div>
    );
};

export default CharacterMiscEditor;
