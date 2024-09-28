import APIHealth from '@services/APIHealth'
import { useEffect, useState } from 'react'

const useIsBackendUnavailable = () => {
    const [isBackendUnavailable, setIsBackendUnavailable] = useState<boolean | null>(APIHealth.isBackendUnavailable())

    useEffect(() => {
        const handleBackendStatusChange = (status: boolean) => {
            setIsBackendUnavailable(status)
        }

        setIsBackendUnavailable(APIHealth.isBackendUnavailable())

        const unsubscribeFromBackendStatusChange = APIHealth.onBackendStatusChange(handleBackendStatusChange)

        return () => {
            unsubscribeFromBackendStatusChange()
        }
    }, [])

    return {
        isBackendUnavailable,
    }
}

export default useIsBackendUnavailable
