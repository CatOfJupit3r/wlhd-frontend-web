import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import useMyStatistics from '@queries/profile/use-my-statistics';
import { FC } from 'react';

interface iShortStats {}

const ShortStats: FC<iShortStats> = () => {
    const { statistics } = useMyStatistics();

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <div className="text-xs text-slate-500">Lobbies</div>
                        <div className="text-lg font-bold">{statistics.lobbies}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xs text-slate-500">Lobbies as GM</div>
                        <div className="text-lg font-bold">{statistics.gmLobbies}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xs text-slate-500">Characters</div>
                        <div className="text-lg font-bold">{statistics.characters}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ShortStats;
