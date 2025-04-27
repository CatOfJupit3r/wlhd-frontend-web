import GameAsset from '@components/GameAsset';
import { useCharacterEditor } from '@context/character-editor';

const CharacterSpriteEditor = () => {
    // Until uploading sprites is implemented, this will be a placeholder

    const { character } = useCharacterEditor();

    return <GameAsset src={character.decorations.sprite} alt={character.decorations.name} className={'size-20'} />;
};

export default CharacterSpriteEditor;
