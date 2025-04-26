import { ReactNode } from 'react';
import { toast } from 'react-toastify';

import { ErrorToast, GameMessageToast, GameMessageToastData, InfoToast, InfoToastData } from './custom-jsx-toasts';
import { CustomToastOptions } from './types';

export const toastGameMessage = (message: ReactNode, options?: CustomToastOptions<GameMessageToastData>) => {
    toast(<GameMessageToast />, {
        data: {
            message,
        },
        position: 'bottom-left',
        closeOnClick: true,
        pauseOnHover: false,
        ...options,
    });
};
export const toastError = (title: string, message?: string, options?: CustomToastOptions<InfoToastData>) => {
    toast(<ErrorToast />, {
        data: {
            title,
            message,
        },
        position: 'top-center',
        closeOnClick: true,
        pauseOnHover: false,
        ...options,
    });
};
export const toastBetterAuthError = (title: string, e: Error, options?: CustomToastOptions<InfoToastData>) => {
    const cause = e.cause as { code: string; message: string };
    return toastError(title, cause.message, options);
};

export const toastInfo = (title: string, message?: string, options?: CustomToastOptions<InfoToastData>) => {
    toast(<InfoToast />, {
        data: {
            title,
            message,
        },
        position: 'top-center',
        closeOnClick: true,
        ...options,
    });
};
