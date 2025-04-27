import { useEffect, useState } from 'react';

import APIHealth from '@services/APIHealth';

const useIsBackendUnavailable = () => {
    const [isBackendUnavailable, setIsBackendUnavailable] = useState<boolean | null>(APIHealth.isBackendUnavailable());

    useEffect(() => {
        const handleBackendStatusChange = (status: boolean) => {
            setIsBackendUnavailable(status);
        };

        setIsBackendUnavailable(APIHealth.isBackendUnavailable());

        const unsubscribeFromBackendStatusChange = APIHealth.onBackendStatusChange(handleBackendStatusChange);

        return () => {
            unsubscribeFromBackendStatusChange();
        };
    }, []);

    return {
        isBackendUnavailable,
    };
};

export default useIsBackendUnavailable;
