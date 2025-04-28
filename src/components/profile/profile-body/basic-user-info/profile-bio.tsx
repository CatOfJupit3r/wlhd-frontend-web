import { FC } from 'react';
import { LuCalendar } from 'react-icons/lu';

import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import useMe from '@queries/use-me';

interface iProfileBio {}

const ProfileBio: FC<iProfileBio> = () => {
    const { user } = useMe();

    return (
        <Card>
            <CardHeader>
                <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                    <LuCalendar className="h-4 w-4 text-slate-500" />
                    <span>Joined: {new Date(user.createdAt).toDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileBio;
