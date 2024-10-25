import Overlay from '@components/Overlay'
import LobbyShortInfo from '@components/ProfileInformation/LobbyShortInfo'
import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Separator } from '@components/ui/separator'
import { CurrentUserAvatar } from '@components/UserAvatars'
import { selectUserInformation } from '@redux/slices/cosmeticsSlice'
import { Calendar, Gamepad, Trophy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const ProfileInformation = () => {
    const { handle, joined, createdAt } = useSelector(selectUserInformation)
    const { t } = useTranslation('local', {
        keyPrefix: 'profile',
    })
    const [showInviteOverlay, setShowInviteOverlay] = useState(false)
    const [inviteCode, setInviteCode] = useState('')

    return (
        <div className="flex justify-center bg-gradient-to-br p-4">
            <Card className="relative w-full max-w-2xl shadow-2xl">
                <CardHeader className="relative pb-0">
                    <div className="absolute left-0 top-0 h-32 w-full rounded-t-lg bg-gradient-to-r from-blue-400 to-purple-400" />
                    <div className="relative flex items-center space-x-4">
                        <CurrentUserAvatar className={'size-32'} />
                        <div className="rounded-2xl bg-white p-2 shadow-lg">
                            <CardTitle className="text-t-bigger font-bold">@{handle}</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="mt-6 grid gap-6">
                    <div className="flex items-center space-x-4 text-t-smaller">
                        <Badge variant="secondary" className="px-3 py-1">
                            <Calendar className="mr-2 size-4" />
                            {t('joined-on')} {new Date(createdAt).toLocaleDateString()}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            <Trophy className="mr-2 size-4" />
                            {t('legacy-member')}
                        </Badge>
                    </div>
                    <Separator />
                    <div className="grid gap-4">
                        <div className="text-t-big font-semibold">{t('joined-lobbies')}</div>
                        <div className="grid gap-4">
                            {joined.map((lobbyId) => (
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
            {showInviteOverlay && (
                <Overlay>
                    <Card className="relative w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>{t('join-new')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p>{t('enter-invite-code')}</p>
                                <Input
                                    type="text"
                                    placeholder={t('invite-code')}
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                />
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setShowInviteOverlay(false)}>
                                        {t('cancel')}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            console.log('Inviting with code:', inviteCode)
                                            setShowInviteOverlay(false)
                                            setInviteCode('')
                                        }}
                                    >
                                        {t('send-invite-request')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Overlay>
            )}
        </div>
    )
}

export default ProfileInformation
