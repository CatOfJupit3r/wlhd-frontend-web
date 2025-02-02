import { toast } from 'react-toastify';

import { ErrorToast, InfoToast, InfoToastData } from './custom-reference-toasts';
import { CustomToastOptions } from './types';

export const toastInfo = (title: string, message?: string, options?: CustomToastOptions<InfoToastData>) => {
    toast(InfoToast, {
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

export const toastError = (title: string, message?: string, options?: CustomToastOptions<InfoToastData>) => {
    toast(ErrorToast, {
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
