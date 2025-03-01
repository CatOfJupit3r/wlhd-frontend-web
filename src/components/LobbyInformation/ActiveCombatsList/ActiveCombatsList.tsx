import { ButtonLink } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { ScrollArea } from '@components/ui/scroll-area';
import { iCombatInfo, iLobbyInformation } from '@models/Redux';
import { cn } from '@utils';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LiaPlusCircleSolid } from 'react-icons/lia';
import { LuSwords } from 'react-icons/lu';
import CombatDisplay from './CombatDisplay';

interface iActiveCombatsList {
    className?: string;
    lobbyId: string;
    combats: Array<iCombatInfo>;
    layout: iLobbyInformation['layout'];
}

const ActiveCombatsList: FC<iActiveCombatsList> = ({ className, combats, layout, lobbyId }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'lobby-info.combats',
    });
    return (
        <Card>
            <CardHeader className={'flex flex-row items-center justify-between'}>
                <CardTitle>
                    <LuSwords className={'mr-2 inline-block'} />
                    {t('title')}
                </CardTitle>
                <div className={''}>
                    {layout === 'gm' ? (
                        <ButtonLink
                            variant={'outline'}
                            className={'h-8 text-sm text-primary'}
                            href={`/lobby-rooms/${lobbyId}/create-combat`}
                        >
                            <LiaPlusCircleSolid className={'mr-2 inline-block'} />
                            {t('new-combat')}
                        </ButtonLink>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className={cn(className, 'flex h-[300px]')}>
                    <div className={'flex w-full flex-col gap-2 border-0 p-0'}>
                        {combats.length > 0 ? (
                            combats.map((combat) => {
                                return <CombatDisplay combat={combat} key={combat._id} lobbyId={lobbyId} />;
                            })
                        ) : (
                            <p className={'text-base italic'}>{t('no-combats')} </p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default ActiveCombatsList;
