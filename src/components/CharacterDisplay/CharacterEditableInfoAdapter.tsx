import { CharacterDataEditable } from '@type-defs/CombatEditorModels';
import { FC } from 'react';

import { CharacterDisplayProps } from '@components/CharacterDisplay/CharacterDisplay';
import { CharacterDisplay } from '@components/CharacterDisplay/index';
import GameConverters from '@services/GameConverters';

type iCharacterEditableInfoAdapter = Omit<CharacterDisplayProps, 'character'> & {
    character: CharacterDataEditable;
};

const CharacterEditableInfoAdapter: FC<iCharacterEditableInfoAdapter> = ({ character, ...props }) => {
    return <CharacterDisplay character={GameConverters.convertCharacterEditableToInfoFull(character)} {...props} />;
};

export default CharacterEditableInfoAdapter;
