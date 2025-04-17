import EnterLobbyButton from '@components/profile/enter-lobby-button';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { FC } from 'react';
import { LuClock, LuCrown } from 'react-icons/lu';

interface iJoinedLobbyCard {
    name: string;
    isGm: boolean;
    _id: string;
    needsApproval: boolean;
    characters: Array<[string, string]>;
}

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
                        {characters.map(([descriptor, name]) => (
                            <Badge key={descriptor} variant="outline" className="px-2 py-1">
                                {name} ({descriptor})
                            </Badge>
                        ))}
                    </div>
                    <EnterLobbyButton lobbyId={_id} variant="ghost" size="sm" disabled={needsApproval}>
                        {needsApproval ? 'View' : 'Pending...'}
                    </EnterLobbyButton>
                </div>
            </CardContent>
        </Card>
    );
};
export default JoinedLobbyCard;
