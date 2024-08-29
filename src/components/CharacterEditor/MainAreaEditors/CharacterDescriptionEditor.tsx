import React, { useCallback, useEffect, useRef } from 'react'
import { Button } from '@components/ui/button'
import { Label } from '@components/ui/label'
import { useCharacterEditorContext } from '@context/CharacterEditorProvider'
import { RxReset } from 'react-icons/rx'
import { cn } from '@utils'
import CharacterLimit from '@components/CharacterEditor/MainAreaEditors/CharacterLimit'

const MAX_DESCRIPTION_LENGTH = 256

const CharacterDescriptionEditor = () => {
    const { character, updateCharacter, initial } = useCharacterEditorContext()

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const setCharacterDescription = useCallback(
        (description: string) => {
            updateCharacter({
                ...character,
                decorations: {
                    ...character.decorations,
                    description,
                },
            })
        },
        [character, updateCharacter]
    )
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [character.decorations.description])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (value.length <= MAX_DESCRIPTION_LENGTH) {
            setCharacterDescription(value)
        }
    }

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
                <CharacterLimit
                    characterLimit={MAX_DESCRIPTION_LENGTH}
                    text={character.decorations.description}
                />
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => {
                        updateCharacter({
                            ...character,
                            decorations: {
                                ...character.decorations,
                                description: initial.decorations.description,
                            },
                        })
                    }}
                    className={'h-5 text-gray-400 hover:text-gray-600'}
                >
                    <RxReset />
                </Button>
            </div>
        </div>
    )
}

export default CharacterDescriptionEditor
