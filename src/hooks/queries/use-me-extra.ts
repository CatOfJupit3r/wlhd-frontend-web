import { useQuery } from '@tanstack/react-query';
import { iUserExtraData } from '@type-defs/api-data';

import { USE_ME_QUERY_KEYS, useMe } from '@queries/useMe';
import APIService from '@services/api-service';

const PLACEHOLDER_DATA: MeExtraQueryResultType = {
    colors: {
        primary: '#000000',
        secondary: '#000000',
    },
};

export const USE_ME_EXTRA_QUERY_KEYS = () => [...USE_ME_QUERY_KEYS(), 'extra'];
export type MeExtraQueryResultType = Awaited<ReturnType<typeof USE_ME_EXTRA_QUERY_FN>>;
export const USE_ME_EXTRA_QUERY_FN = () => {
    return APIService.getMyExtraData();
};

const useMeExtra = () => {
    const { isLoggedIn } = useMe();

    const { data, isPending, isError } = useQuery<iUserExtraData>({
        enabled: isLoggedIn,
        queryKey: USE_ME_EXTRA_QUERY_KEYS(),
        queryFn: USE_ME_EXTRA_QUERY_FN,
    });

    return {
        meExtra: data ?? PLACEHOLDER_DATA,
        isPending,
        isError,
    };
};

export default useMeExtra;
