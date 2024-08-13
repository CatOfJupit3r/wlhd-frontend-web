import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { EntityInfoFull } from '@models/Battlefield'

export interface CharacterEditorContextType {
    character: EntityInfoFull
    initial: EntityInfoFull
    updateCharacter: (character: EntityInfoFull) => void
    resetCharacter: () => void
    flags: {
        attributes?: {
            ignored?: Array<string>
            nonEditable?: Array<string>
        }
        weaponry?: {
            allowCooldown?: boolean
            allowQuantity?: boolean
            allowUses?: boolean

            allowActivation?: boolean

            allowExceedCooldown?: boolean
        }
        inventory?: {
            allowCooldown?: boolean
            allowQuantity?: boolean
            allowUses?: boolean

            allowExceedCooldown?: boolean
        }
        statusEffects?: {
            allowDuration?: boolean
        }
        spellBook?: {
            allowCooldown?: boolean
            allowUses?: boolean
            allowActivation?: boolean

            allowExceedCooldown?: boolean

            allowChangeMaxSpells?: boolean
        }

        exclude?: {
            name?: boolean
            description?: boolean
            sprite?: boolean

            attributes?: boolean
            inventory?: boolean
            spellBook?: boolean
            statusEffects?: boolean
            weaponry?: boolean

            [key: string]: unknown // in order for flags to be accessible by key
        }
    }
}

const CharacterEditorContext = createContext<CharacterEditorContextType | undefined>(undefined)

type CharacterEditorProviderProps = {
    children: React.ReactNode
    character: CharacterEditorContextType['character']
    setEditedCharacter: CharacterEditorContextType['updateCharacter']
    flags?: CharacterEditorContextType['flags']
}

export const CharacterEditorProvider = ({
    children,
    character,
    setEditedCharacter,
    flags,
}: CharacterEditorProviderProps) => {
    const [initial] = useState(character)

    const resetCharacter = useCallback(() => {
        setEditedCharacter(initial)
    }, [initial, setEditedCharacter])

    const value = useMemo(
        () => ({
            character,
            initial,
            updateCharacter: setEditedCharacter,
            resetCharacter,
            flags: flags ?? {},
        }),
        [character, initial, setEditedCharacter, resetCharacter, flags]
    )

    return <CharacterEditorContext.Provider value={value}>{children}</CharacterEditorContext.Provider>
}

export const buildCharacterEditorProps = (character: EntityInfoFull) => {
    const [editedCharacter, setEditedCharacter] = useState(character)

    const resetCharacter = useCallback(() => {
        setEditedCharacter(character)
    }, [character])

    const changeEditedCharacter = useCallback((newCharacter: EntityInfoFull) => {
        setEditedCharacter(newCharacter)
    }, [])

    return {
        character: editedCharacter,
        changeEditedCharacter,
        resetCharacter,
    }
}

export const useCharacterEditorContext = () => {
    const context = useContext(CharacterEditorContext)
    if (!context) {
        throw new Error('useCharacterEditorContext must be used within a CharacterEditorProvider')
    }
    return context
}
