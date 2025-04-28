import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useDualTranslation = (namespace?: string, options?: { keyPrefix: string }) => {
    const { t: tI18N } = useTranslation();

    const prefix = useMemo(() => {
        let prefix = '';
        if (namespace) {
            prefix = `${namespace}:`;
        }
        if (options?.keyPrefix) {
            prefix += `${options.keyPrefix}`;
        }
        return prefix;
    }, [namespace, options]);

    const t = useCallback(
        (
            key: string,
            options?: {
                includePrefix?: boolean;
                format?: Record<string, string>;
            },
        ) => {
            const { includePrefix = true, format } = options ?? {};

            if (includePrefix) {
                return tI18N(`${prefix}.${key}`, {
                    ...(format ?? {}),
                });
            }
            return tI18N(key, {
                ...(format ?? {}),
            });
        },
        [tI18N, prefix],
    );

    return { t };
};

export default useDualTranslation;
