import GameAsset from '@components/GameAsset';
import { useCharacterEditorContext } from '@context/CharacterEditorProvider';

const CharacterSpriteEditor = () => {
    // Until uploading sprites is implemented, this will be a placeholder

    const { character } = useCharacterEditorContext();

    return <GameAsset src={character.decorations.sprite} alt={character.decorations.name} className={'size-20'} />;
};

export default CharacterSpriteEditor;
