import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
} from '@components/ui/alert-dialog';
import SocketService from '@services/SocketService';

const LeaveGameOverlay = ({ setChosen }: { setChosen: (value: string | null) => void }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.exit',
    });
    const navigate = useNavigate();

    const leaveGame = useCallback(() => {
        SocketService.disconnect();
        setChosen(null);
        navigate({
            to: '..',
        });
    }, []);

    const stayInGame = useCallback(() => {
        setChosen(null);
    }, []);

    return (
        <AlertDialog
            open={true}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setChosen(null);
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogTitle>{t('header')}</AlertDialogTitle>
                <AlertDialogDescription>{t('subheader')}</AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={stayInGame}>{t('no')}</AlertDialogCancel>
                    <AlertDialogAction onClick={leaveGame}>{t('yes')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LeaveGameOverlay;
