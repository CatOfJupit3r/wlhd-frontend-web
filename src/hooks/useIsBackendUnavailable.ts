import { useEffect, useState } from 'react'
import APIService from '@services/APIService'

const useIsBackendUnavailable = () => {
    const [isBackendUnavailable, setIsBackendUnavailable] = useState(APIService.isBackendUnavailable())

    useEffect(() => {
        const unsubscribeFromBackendStatusChange = APIService.onBackendStatusChange((status) => {
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
