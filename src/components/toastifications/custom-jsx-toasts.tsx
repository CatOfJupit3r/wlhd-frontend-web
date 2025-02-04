import { ReactNode } from 'react';

import { useTranslation } from 'react-i18next';

import { ToastBody, ToastDescription, ToastTitle } from './common-toast-parts';
import { CustomReferenceToastFC, CustomToastFC } from './types';

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

export type InfoToastData = {
    title: string;
    message?: string;
};
const InfoToast: CustomReferenceToastFC<InfoToastData> = ({ data }) => {
    return (
        <ToastBody className={'flex flex-col gap-2'}>
            <ToastTitle className={'text-sm font-medium text-accent-foreground'}>{data?.title}</ToastTitle>
            {data?.message ? <ToastDescription>{data?.message}</ToastDescription> : null}
        </ToastBody>
    );
};
export type ErrorToastData = {
    title: string;
    message?: string;
};
const ErrorToast: CustomReferenceToastFC<ErrorToastData> = ({ data }) => {
    return (
        <ToastBody className={'flex flex-col gap-2'}>
            <ToastTitle className={'text-sm font-medium text-red-500'}>{data?.title}</ToastTitle>
            {data?.message ? <ToastDescription>{data?.message}</ToastDescription> : null}
        </ToastBody>
    );
};

export { InfoToast, ErrorToast, GameMessageToast };
