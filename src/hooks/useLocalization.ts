import {useCallback} from 'react';
import {useTranslation} from "react-i18next";

const useLocalization = () => {
    const {t} = useTranslation()

    const localize = useCallback((cmd: [
        string, ...any[]
    ]): string => {
        try {
            const [stringId, ...args] = cmd;
            if ((args && args.length === 0) || !args) {
                return t(stringId);
            }
            const parsedArgs: string[] = [];

            for (let arg of args) {
                if (Array.isArray(arg)) {
                    for (let subArg of arg) {
                        parsedArgs.push(localize(subArg));
                    }
                } else if (typeof arg === 'number') {
                    parsedArgs.push(arg.toString());
                } else {
                    parsedArgs.push(arg);
                }
            }
            return t(stringId).replace(/{(\d+)}/g, (match, index) => {
                return typeof parsedArgs[index] !== 'undefined' ? parsedArgs[index] : match;
            });
        } catch (e) {
            console.error(e);
            return cmd[0];
        }
    }, [t]);

    return localize;
};

export default useLocalization;