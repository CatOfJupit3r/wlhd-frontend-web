import {
    CreateNewMemoryWithAccordion,
    MemoriesEditor,
    TagsEditor,
} from '@components/CharacterEditor/GameComponentEditors/ComponentSegmentEditors'
import { EmptyMenuContent } from '@components/ui/menu'
import { useCharacterEditorContext } from '@context/CharacterEditorProvider'
import { GameComponentMemory } from '@models/GameModels'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const CharacterMiscEditor = () => {
    const { character, updateCharacter } = useCharacterEditorContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'editor',
    })

    const editMemoryCallback = useCallback(
        <T extends 'tags' | 'memory'>(
            key: T,
            value: T extends 'tags' ? string[] : T extends 'memory' ? GameComponentMemory : never
        ) => {
            if (key === 'tags') {
                updateCharacter({
                    ...character,
                    tags: value as string[],
                })
            }
            if (key === 'memory') {
                updateCharacter({
                    ...character,
                    memory: value as GameComponentMemory,
                })
            }
        },
        [character, updateCharacter]
    )

    return (
        <div className={'flex w-full flex-col gap-2'}>
            <div className={'flex w-full flex-col justify-center gap-1 p-4'}>
                <p className={'text-center text-t-normal'}>{t('memories.title')}</p>
                <CreateNewMemoryWithAccordion component={character} changeComponentField={editMemoryCallback} />
                {character.memory && Object.keys(character.memory).length === 0 ? (
                    <EmptyMenuContent />
                ) : (
                    <MemoriesEditor component={character} changeComponentField={editMemoryCallback} />
                )}
            </div>
            <div className={'flex w-full flex-col justify-center gap-1 p-4'}>
                <p className={'text-center text-t-normal'}>{t('tags.title')}</p>
                <TagsEditor component={character} changeComponentField={editMemoryCallback} />
            </div>
        </div>
    )
}

export default CharacterMiscEditor
