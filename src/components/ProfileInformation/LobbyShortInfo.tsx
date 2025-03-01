import { Card, CardContent } from '@components/ui/card';
import CommaSeparatedList from '@components/ui/coma-separated-list';
import { Skeleton } from '@components/ui/skeleton';
import StyledLink from '@components/ui/styled-link';
import useLobbyShortInfo from '@queries/useLobbyShortInfo';
import { Route as LobbyRoomRoute } from '@router/_auth_only/lobby-rooms/$lobbyId/';
import { cn } from '@utils';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCrown } from 'react-icons/lu';

const LobbyShortInfo = ({ lobbyId }: { lobbyId: string }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'profile',
    });
    const { lobbyInfo, isLoading, isError } = useLobbyShortInfo(lobbyId);
    const [placeholderParams] = useState({
        title: Math.floor(Math.random() * 16) + 5,
        description: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
            () => Math.floor(Math.random() * 8) + 8,
        ),
    });

    const LinkToLobby = useCallback(
        () => <p className="text-xl font-semibold">{lobbyInfo.name || '???'}</p>,
        [lobbyInfo.name],
    );

    const Placeholders = useCallback(
        ({ pulsating = true }: { pulsating?: boolean }) => (
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton
                        className={`h-6 ${pulsating ? 'animate-pulse' : ''}`}
                        style={{ width: `${placeholderParams.title}rem` }}
                    />
                </div>
                {placeholderParams.description.map((width, index) => (
                    <Skeleton
                        key={index}
                        className={`h-4 ${pulsating ? 'animate-pulse' : ''}`}
                        style={{ width: `${width}rem` }}
                    />
                ))}
            </div>
        ),
        [placeholderParams],
    );

    const LobbyInfoContent = useCallback(
        () => (
            <div className="space-y-1">
                <div className="flex items-center space-x-2">
                    {lobbyInfo.isGm && <LuCrown className="size-5 text-yellow-500" />}
                    <LinkToLobby />
                </div>
                <CommaSeparatedList
                    className="text-base text-muted-foreground"
                    items={lobbyInfo.characters}
                    renderItem={([descriptor, name]) => {
                        return (
                            <p>
                                {t(name)} ({descriptor})
                            </p>
                        );
                    }}
                    emptyMessage={t('no-character-assigned')}
                />
            </div>
        ),
        [lobbyInfo, t],
    );

    const DecideWhatToShow = useCallback(() => {
        if (isLoading) return <Placeholders pulsating={true} />;
        if (!isError) return <LobbyInfoContent />;
        return <Placeholders pulsating={false} />;
    }, [isError, isLoading, LobbyInfoContent, Placeholders]);

    return (
        <StyledLink
            to={LobbyRoomRoute.to}
            params={{
                lobbyId,
            }}
            className={cn('block w-full no-underline')}
            disabled={lobbyInfo?.needsApproval}
        >
            <Card className="transition-colors duration-200 hover:bg-accent">
                <CardContent className="p-4">
                    <DecideWhatToShow />
                </CardContent>
            </Card>
        </StyledLink>
    );
};

export default LobbyShortInfo;
