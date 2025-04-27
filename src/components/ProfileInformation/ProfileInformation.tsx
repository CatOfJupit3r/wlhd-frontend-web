import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendar, LuGamepad, LuTrophy } from 'react-icons/lu';

import LobbyShortInfo from '@components/ProfileInformation/LobbyShortInfo';
import { CurrentUserAvatar } from '@components/UserAvatars';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
} from '@components/ui/alert-dialog';
import { Badge } from '@components/ui/badge';
import { Button, MutationButton } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Separator } from '@components/ui/separator';
import useJoinLobbyUsingInviteCode from '@mutations/profile/useJoinLobbyUsingInviteCode';
import useJoinedLobbies from '@queries/profile/useJoinedLobbies';
import useMe from '@queries/useMe';

const ProfileInformation = () => {
    const { user } = useMe();
    const { joined } = useJoinedLobbies();
    const { t } = useTranslation('local', {
        keyPrefix: 'profile',
    });
    const [showInviteOverlay, setShowInviteOverlay] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const { joinLobbyUsingInviteCode, isPending } = useJoinLobbyUsingInviteCode();

    return (
        <div className="flex justify-center bg-gradient-to-br p-4">
            <Card className="relative w-full max-w-5xl shadow-2xl">
                <CardHeader className="relative pb-0">
                    <div className="absolute left-0 top-0 h-32 w-full rounded-t-lg bg-gradient-to-r from-blue-400 to-purple-400" />
                    <div className="relative flex items-center space-x-4">
                        <CurrentUserAvatar className={'size-32'} />
                        <div className="rounded-lg bg-white px-2 py-1 shadow-lg">
                            <CardTitle className="text-3.5xl font-bold">{user.name}</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="mt-6 grid gap-6">
                    <div className="flex items-center space-x-4 text-sm">
                        <Badge variant="secondary" className="px-3 py-1">
                            <LuCalendar className="mr-2 size-4" />
                            {t('joined-on')} {new Date(user.createdAt).toLocaleDateString()}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            <LuTrophy className="mr-2 size-4" />
                            {t('legacy-member')}
                        </Badge>
                    </div>
                    <Separator />
                    <div className="grid gap-4">
                        <div className="text-2xl font-semibold">{t('joined-lobbies')}</div>
                        <div className="grid gap-4">
                            {joined.map((lobby) => (
                                <LobbyShortInfo key={lobby._id} info={lobby} />
                            ))}
                        </div>
                    </div>
                    <Button className="w-full" onClick={() => setShowInviteOverlay(true)}>
                        <LuGamepad className="mr-2 size-4" />
                        {t('join-new')}
                    </Button>
                </CardContent>
            </Card>
            <AlertDialog open={showInviteOverlay}>
                <AlertDialogContent className={'flex w-full max-w-2xl flex-col gap-6'}>
                    <AlertDialogTitle>{t('join-new')}</AlertDialogTitle>
                    <AlertDialogDescription className={'flex flex-col gap-2'}>
                        {t('enter-invite-code')}
                        <Input
                            type="text"
                            placeholder={t('invite-code')}
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                        />
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowInviteOverlay(false)} className={'w-full'}>
                            {t('close')}
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <MutationButton
                                mutate={() => {
                                    joinLobbyUsingInviteCode(inviteCode);
                                }}
                                isPending={isPending}
                                className={'w-full'}
                            >
                                {t('send-invite-request')}
                            </MutationButton>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProfileInformation;
