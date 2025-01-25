import LobbyShortInfo from '@components/ProfileInformation/LobbyShortInfo'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
} from '@components/ui/alert-dialog'
import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Separator } from '@components/ui/separator'
import { CurrentUserAvatar } from '@components/UserAvatars'
import useMe from '@queries/useMe'
import { Calendar, Gamepad, Trophy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ProfileInformation = () => {
    const { user } = useMe()
    const { t } = useTranslation('local', {
        keyPrefix: 'profile',
    })
    const [showInviteOverlay, setShowInviteOverlay] = useState(false)
    const [inviteCode, setInviteCode] = useState('')

    return (
        <div className="flex justify-center bg-gradient-to-br p-4">
            <Card className="relative w-full max-w-5xl shadow-2xl">
                <CardHeader className="relative pb-0">
                    <div className="absolute left-0 top-0 h-32 w-full rounded-t-lg bg-gradient-to-r from-blue-400 to-purple-400" />
                    <div className="relative flex items-center space-x-4">
                        <CurrentUserAvatar className={'size-32'} />
                        <div className="rounded-2xl bg-white p-2 shadow-lg">
                            <CardTitle className="text-3.5xl font-bold">@{user.handle}</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="mt-6 grid gap-6">
                    <div className="flex items-center space-x-4 text-sm">
                        <Badge variant="secondary" className="px-3 py-1">
                            <Calendar className="mr-2 size-4" />
                            {t('joined-on')} {new Date(user.createdAt).toLocaleDateString()}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            <Trophy className="mr-2 size-4" />
                            {t('legacy-member')}
                        </Badge>
                    </div>
                    <Separator />
                    <div className="grid gap-4">
                        <div className="text-2xl font-semibold">{t('joined-lobbies')}</div>
                        <div className="grid gap-4">
                            {user.joined.map((lobbyId) => (
                                <LobbyShortInfo key={lobbyId} lobbyId={lobbyId} />
                            ))}
                        </div>
                    </div>
                    {
                        // <div className="grid gap-4">
                        //     <div className="text-lg font-semibold">{t('profile.pendingInvites')}</div>
                        //     {userInfo.pendingInvites.map((invite) => (
                        //         <Card key={invite.id}>
                        //             <CardContent className="flex items-center justify-between p-4">
                        //                 <div>
                        //                     <p className="font-semibold">{invite.lobby}</p>
                        //                     <p className="text-sm text-muted-foreground">
                        //                         {t('profile.from')}: {invite.from}
                        //                     </p>
                        //                 </div>
                        //                 <div className="flex space-x-2">
                        //                     <Button
                        //                         size="sm"
                        //                         variant="destructive"
                        //                         onClick={() => console.log('Declined invite:', invite.id)}
                        //                     >
                        //                         {t('profile.decline')}
                        //                     </Button>
                        //                     <Button size="sm" onClick={() => console.log('Accepted invite:', invite.id)}>
                        //                         {t('profile.accept')}
                        //                     </Button>
                        //                 </div>
                        //             </CardContent>
                        //         </Card>
                        //     ))}
                        // </div>
                    }
                    <Button className="w-full" onClick={() => setShowInviteOverlay(true)}>
                        <Gamepad className="mr-2 size-4" />
                        {t('join-new')}
                    </Button>
                </CardContent>
            </Card>
            <AlertDialog open={showInviteOverlay}>
                <AlertDialogContent className={'w-full max-w-2xl'}>
                    <AlertDialogTitle>{t('join-new')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <p>{t('enter-invite-code')}</p>
                        <Input
                            type="text"
                            placeholder={t('invite-code')}
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                        />
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowInviteOverlay(false)}>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                console.log('Inviting with code:', inviteCode)
                                setShowInviteOverlay(false)
                                setInviteCode('')
                            }}
                        >
                            {t('send-invite-request')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ProfileInformation
