import { FC } from 'react';
import { LuClock, LuCrown } from 'react-icons/lu';

import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { EnterLobbyButton } from '@components/ui/common-links';
import { Skeleton } from '@components/ui/skeleton';
import useLobbyShortInfo from '@queries/profile/use-lobby-short-info';

interface iJoinedLobbyCard {
    name: string;
    isGm: boolean;
    _id: string;
    needsApproval: boolean;
    characters: Array<[string, string]>;
}

const PlaceholderCard: FC<{ pulsating: boolean }> = ({ pulsating }) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Skeleton className="h-6 w-24" pulsating={pulsating} />
                        <Skeleton className="h-4 w-12" pulsating={pulsating} />
                    </CardTitle>
                    <Skeleton className="h-4 w-12" pulsating={pulsating} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[...Array(Math.min(3, 3))].map((_, i) => (
                            <Skeleton key={i} className="h-6 w-6 border-2 border-background" pulsating={pulsating} />
                        ))}
                        <Skeleton
                            className="h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-slate-100 text-xs dark:bg-slate-800"
                            pulsating={pulsating}
                        />
                    </div>
                    <Skeleton className="h-8 gap-2" pulsating={pulsating} />
                </div>
            </CardContent>
        </Card>
    );
};

const JoinedLobbyCard: FC<iJoinedLobbyCard> = ({ name, isGm, _id, needsApproval, characters }) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {name}
                        {isGm && <LuCrown className="h-4 w-4 text-purple-500" title="You are an admin" />}
                    </CardTitle>
                    {needsApproval ? (
                        <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                        >
                            <LuClock className="mr-1 h-3 w-3" /> Pending
                        </Badge>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {characters.length > 0 ? (
                            <Badge variant="outline" className="px-2 py-1">
                                {characters[0][1]}
                            </Badge>
                        ) : null}
                        {characters.length > 1 ? <div>+{characters.length - 2}</div> : null}
                    </div>
                    <EnterLobbyButton lobbyId={_id} variant="ghost" size="sm" disabled={needsApproval}>
                        {needsApproval ? 'Pending...' : 'View'}
                    </EnterLobbyButton>
                </div>
            </CardContent>
        </Card>
    );
};

export const JoinedLobbyWithId = ({ lobbyId }: { lobbyId: string }) => {
    const { lobbyInfo, isLoading, isError } = useLobbyShortInfo(lobbyId);

    if (isLoading || isError) {
        return <PlaceholderCard pulsating={isLoading} />;
    }

    return (
        <JoinedLobbyCard
            name={lobbyInfo.name}
            isGm={lobbyInfo.isGm}
            _id={lobbyId}
            needsApproval={lobbyInfo.needsApproval}
            characters={lobbyInfo.characters}
        />
    );
};

export default JoinedLobbyCard;
