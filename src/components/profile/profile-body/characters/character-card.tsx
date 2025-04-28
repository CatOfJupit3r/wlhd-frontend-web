import { iMyCharacter } from '@type-defs/api-data';
import { FC } from 'react';
import { LuExternalLink } from 'react-icons/lu';

import GameAsset from '@components/GameAsset';
import { ViewCharacterButton } from '@components/ui/common-links';

interface iCharacterCard {
    character: iMyCharacter;
}

const CharacterCard: FC<iCharacterCard> = ({ character }) => {
    return (
        <div className="flex items-start gap-4">
            <GameAsset src={character.decorations.sprite} alt={character.descriptor} className="h-16 w-16" />

            <div className="flex-1">
                <h4 className="font-medium">
                    {character.decorations.name} (@{character.descriptor})
                </h4>
                <p className="text-sm text-slate-500">{character.decorations.description}</p>
            </div>
            <ViewCharacterButton
                variant="ghost"
                size="sm"
                character={character.descriptor}
                lobbyId={character.lobbyId}
                className="gap-2"
            >
                <LuExternalLink className="h-4 w-4" />
                View
            </ViewCharacterButton>
        </div>
    );
};

export default CharacterCard;
