import APIHealth from '@services/APIHealth'
import { useEffect, useState } from 'react'

const useIsBackendUnavailable = () => {
    const [isBackendUnavailable, setIsBackendUnavailable] = useState(APIHealth.isBackendUnavailable())

    useEffect(() => {
        const unsubscribeFromBackendStatusChange = APIHealth.onBackendStatusChange((status) => {
            setIsBackendUnavailable(status)
        })
        return () => {
            unsubscribeFromBackendStatusChange()
        }
    }, [])

    return {
        isBackendUnavailable,
    }
}

export default useIsBackendUnavailable
