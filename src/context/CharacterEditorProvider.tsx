import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CharacterDataEditable } from '@models/CombatEditorModels'

export interface CharacterEditorFlags {
    attributes?: {
        ignored?: Array<string>
        nonEditable?: Array<string>
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
        characterMemory?: boolean

        [key: string]: unknown // in order for flags to be accessible by key
    }
}

export interface CharacterEditorContextType {
    character: CharacterDataEditable
    initial: CharacterDataEditable
    updateCharacter: (character: CharacterDataEditable) => void
    resetCharacter: () => void
    flags: CharacterEditorFlags
    mode: 'save' | 'preset'
    changeMode: (mode: 'save' | 'preset') => void
}

const CharacterEditorContext = createContext<CharacterEditorContextType | undefined>(undefined)

type CharacterEditorProviderProps = {
    children: React.ReactNode
    character: CharacterEditorContextType['character']
    setEditedCharacter: CharacterEditorContextType['updateCharacter']
    flags?: CharacterEditorFlags
}

export const CharacterEditorProvider = ({
    children,
    character,
    setEditedCharacter,
    flags,
}: CharacterEditorProviderProps) => {
    const [initial] = useState(character)
    const [mode, setMode] = useState<CharacterEditorContextType['mode']>('save')

    const resetCharacter = useCallback(() => {
        setEditedCharacter(initial)
    }, [initial, setEditedCharacter])

    const changeMode = useCallback((newMode: CharacterEditorContextType['mode']) => {
        setMode(newMode)
    }, [])

    const value = useMemo(
        () => ({
            character,
            initial,
            updateCharacter: setEditedCharacter,
            resetCharacter,
            mode,
            changeMode,
            flags: flags || {},
        }),
        [character, initial, setEditedCharacter, resetCharacter, flags, mode, changeMode]
    )

    return <CharacterEditorContext.Provider value={value}>{children}</CharacterEditorContext.Provider>
}

export const useBuildCharacterEditorProps = (character: CharacterDataEditable) => {
    const [editedCharacter, setEditedCharacter] = useState(character)

    const resetCharacter = useCallback(() => {
        setEditedCharacter(character)
    }, [character])

    const changeEditedCharacter = useCallback((newCharacter: CharacterDataEditable) => {
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
