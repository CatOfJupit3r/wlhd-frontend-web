import GameAsset from '@components/GameAsset';
import { ButtonLink } from '@components/ui/button';
import { iCharacterInLobby } from '@models/Redux';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface iShortCharacterInfo {
    character: iCharacterInLobby;
    lobbyId: string;
}

const ShortCharacterInfo: FC<iShortCharacterInfo> = ({
    lobbyId,
    character: {
        descriptor,
        decorations: { name, description, sprite },
    },
}) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'lobby-info.all-characters',
    });

    return (
        <div className={'flex flex-col gap-3'}>
            <div className={'flex flex-row justify-between'}>
                <div className={'flex flex-row gap-2'}>
                    <GameAsset className={'size-12'} src={sprite} alt={descriptor} />
                    <p className={'text-md'}>{name}</p>
                </div>
                <ButtonLink
                    to={`/lobby-rooms/$lobbyId/view-character`}
                    variant={'outline'}
                    params={{ lobbyId }}
                    search={{
                        character: descriptor,
                    }}
                >
                    {t('view-specific')}
                </ButtonLink>
            </div>
            <p className={'text-sm text-gray-400'}>{description}</p>
        </div>
    );
};

export default ShortCharacterInfo;
