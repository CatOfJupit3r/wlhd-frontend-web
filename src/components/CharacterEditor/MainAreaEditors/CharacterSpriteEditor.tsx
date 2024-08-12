import GameAsset from '@components/GameAsset'
import React from 'react'
import { useCharacterEditorContext } from '@components/ContextProviders/CharacterEditorProvider'

const CharacterSpriteEditor = () => {
    // Until uploading sprites is implemented, this will be a placeholder

    const { character } = useCharacterEditorContext()

    return (
        <GameAsset src={character.decorations.sprite} alt={character.decorations.name} className={'size-20'} />
    )
}

export default CharacterSpriteEditor