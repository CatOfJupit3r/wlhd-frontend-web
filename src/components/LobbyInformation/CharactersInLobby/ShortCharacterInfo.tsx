import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import GameAsset from '@components/GameAsset';
import { ViewCharacterButton } from '@components/ui/common-links';
import { iCharacterInLobby } from '@models/api-data';

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
                <ViewCharacterButton variant={'outline'} character={descriptor} lobbyId={lobbyId}>
                    {t('view-specific')}
                </ViewCharacterButton>
            </div>
            <p className={'text-sm text-gray-400'}>{description}</p>
        </div>
    );
};

export default ShortCharacterInfo;
