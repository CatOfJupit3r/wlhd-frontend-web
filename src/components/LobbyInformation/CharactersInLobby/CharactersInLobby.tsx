import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineGroups3 } from 'react-icons/md';

import ShortCharacterInfo from '@components/LobbyInformation/CharactersInLobby/ShortCharacterInfo';
import { ButtonLink } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { ScrollArea } from '@components/ui/scroll-area';
import { iCharacterInLobby } from '@models/Redux';

interface iCharactersInLobby {
    characters: Array<iCharacterInLobby>;
    lobbyId: string;
}

const CharactersInLobby: FC<iCharactersInLobby> = ({ characters, lobbyId }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'lobby-info.all-characters',
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                    <MdOutlineGroups3 className="mr-2 inline-block" />
                    {t('title')}
                </CardTitle>
                <ButtonLink to={`/lobby-rooms/$lobbyId/view-character`} params={{ lobbyId }} variant={'outline'}>
                    {t('goto-view-characters')}
                </ButtonLink>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px]">
                    <div className={'flex w-full flex-col gap-2 border-0 p-0'}>
                        {characters?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {characters.map((character) => (
                                    <ShortCharacterInfo
                                        character={character}
                                        key={character.descriptor}
                                        lobbyId={lobbyId}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">{t('no-characters')}</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default CharactersInLobby;
