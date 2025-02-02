import { ReactNode } from 'react';
import { toast } from 'react-toastify';

import { GameMessageToast, GameMessageToastData } from './custom-jsx-toasts';
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
