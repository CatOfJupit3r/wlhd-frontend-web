import { ReactNode } from 'react';

import { useTranslation } from 'react-i18next';

import { ToastBody, ToastDescription, ToastTitle } from './common-toast-parts';
import { CustomToastFC } from './types';

export type GameMessageToastData = {
    message: ReactNode;
};

const GameMessageToast: CustomToastFC<GameMessageToastData> = ({ data }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.utility',
    });

    if (!data) return null;
    return (
        <ToastBody>
            <ToastTitle>{t('new-message')}</ToastTitle>
            <ToastDescription className={'text-accent-foreground'}>{data.message}</ToastDescription>
        </ToastBody>
    );
};

export { GameMessageToast };
