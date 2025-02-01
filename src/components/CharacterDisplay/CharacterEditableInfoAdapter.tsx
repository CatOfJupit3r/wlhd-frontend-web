import { CharacterDisplayProps } from '@components/CharacterDisplay/CharacterDisplay';
import { CharacterDisplay } from '@components/CharacterDisplay/index';
import { CharacterDataEditable } from '@models/CombatEditorModels';
import GameConverters from '@services/GameConverters';
import { FC } from 'react';

type iCharacterEditableInfoAdapter = Omit<CharacterDisplayProps, 'character'> & {
    character: CharacterDataEditable;
};

const CharacterEditableInfoAdapter: FC<iCharacterEditableInfoAdapter> = ({ character, ...props }) => {
    return <CharacterDisplay character={GameConverters.convertCharacterEditableToInfoFull(character)} {...props} />;
};

export default CharacterEditableInfoAdapter;
