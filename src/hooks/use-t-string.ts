import { TranslatableString } from '@type-defs/game-types';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { isDescriptor } from '@utils';

const useTString = () => {
    const { t } = useTranslation();

    const formTranslation = useCallback(
        (msg: TranslatableString): string => {
            if (!('args' in msg)) {
                return t(msg.key);
            }
            const keys = Object.keys(msg.args);
            const newArgs: { [key: string]: string } = {};
            for (const key of keys) {
                const arg = msg.args[key];
                if (typeof arg === 'string') {
                    // only translate if it is a descriptor
                    if (isDescriptor(arg)) {
                        newArgs[key] = t(arg);
                    } else {
                        newArgs[key] = arg;
                    }
                } else if (typeof arg === 'object' && ('key' in arg || 'args' in arg)) {
                    // this captures nested translatable strings
                    newArgs[key] = formTranslation(arg);
                } else {
                    // however, as of latest update it is possible for number, boolean, etc to be passed as arguments
                    // in this case, we just pass them as is
                    newArgs[key] = arg;
                }
            }
            return t(msg.key, newArgs);
        },
        [t],
    );

    return {
        TString: formTranslation,
    };
};

export default useTString;
