import { FC } from 'react';

import { useGameCharacterInformation } from '@queries/game-data/use-game-data';

import CharacterDisplayPlaceholder from './CharacterDisplayPlaceholder';
import CharacterEditableInfoAdapter from './CharacterEditableInfoAdapter';

interface iCharacterInfoWithDescriptor {
    dlc: string;
    descriptor: string;
}

const CharacterInfoWithDescriptor: FC<iCharacterInfoWithDescriptor> = ({ dlc, descriptor }) => {
    const { character, isPending } = useGameCharacterInformation(dlc, descriptor);

    if (isPending || !character) {
        return <CharacterDisplayPlaceholder />;
    }
    return <CharacterEditableInfoAdapter character={character} />;
};

export default CharacterInfoWithDescriptor;
