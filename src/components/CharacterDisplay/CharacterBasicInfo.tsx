import { useTranslation } from 'react-i18next';

import { CharacterGameAsset } from '@components/GameAsset';
import { LocationIcon } from '@components/icons';
import { isDescriptor } from '@utils';

const CharacterBasicInfo = ({
    includeSquare = true,
    includeDescription = true,
    character,
}: {
    includeSquare?: boolean;
    includeDescription?: boolean;
    character: {
        name: string;
        sprite: string;
        description: string | null;
        square: {
            line: number;
            column: number;
        } | null;
    };
}) => {
    const { t } = useTranslation();

    return (
        <div className={'flex flex-row gap-4'}>
            <CharacterGameAsset
                src={character.sprite}
                alt={character.name}
                className={'size-20'}
                line={character?.square?.line || 0}
            />
            <div>
                <div className={'text-ellipsis text-left text-xl font-bold'}>
                    {isDescriptor(character.name) ? t(character.name) : character.name}
                </div>
                {includeSquare && character.square && (
                    <div className={'flex flex-row items-center gap-1'}>
                        <LocationIcon className={'size-5'} />
                        <p className={'text-sm font-semibold'}>
                            {character.square.line}/{character.square.column}
                        </p>
                    </div>
                )}
                {includeDescription && (
                    <div className={'text-wrap text-left text-sm italic text-gray-400'}>
                        {character.description
                            ? isDescriptor(character.description)
                                ? t(character.description)
                                : character.description
                            : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CharacterBasicInfo;
