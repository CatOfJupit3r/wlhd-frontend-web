import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@components/ui/alert-dialog';
import { MutationButton } from '@components/ui/button';
import { Input } from '@components/ui/input';
import useJoinLobbyUsingInviteCode from '@mutations/profile/useJoinLobbyUsingInviteCode';
import { FC, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface iJoinNewLobby {
    children?: ReactNode;
}

const JoinNewLobby: FC<iJoinNewLobby> = ({ children }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'profile',
    });
    const [inviteCode, setInviteCode] = useState('');
    const { joinLobbyUsingInviteCode, isPending } = useJoinLobbyUsingInviteCode();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
                    <AlertDialogCancel className={'w-full'}>{t('close')}</AlertDialogCancel>
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
    );
};

export default JoinNewLobby;
