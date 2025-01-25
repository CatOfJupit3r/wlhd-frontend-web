import APIService from '@services/APIService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { UserInformation } from '@models/APIData'
import AuthManager, { LOGIN_STATUS } from '@services/AuthManager'

const PLACEHOLDER_USER: UserInformation = {
    handle: '',
    createdAt: '',
    joined: [],
}

// Custom hook for fetching user information
export const useMe = () => {
    const queryClient = useQueryClient()
    const [loggedIn, setLoggedIn] = useState(AuthManager.isLoggedIn())

    useEffect(() => {
        const unsubscribeFromLoginStatusChange = AuthManager.onLoginStatusChange((token) => {
            if (token === LOGIN_STATUS.LOGGED_OUT) {
                setLoggedIn(false)
                queryClient.removeQueries({
                    queryKey: ['user', 'me'],
                    refetchActive: true,
                })
            } else if (token === LOGIN_STATUS.LOGGED_IN) {
                setLoggedIn(true)
                queryClient.invalidateQueries({
                    queryKey: ['user', 'me'],
                    refetchType: 'active',
                    refetchActive: true,
                })
            }
        })
        return () => {
            unsubscribeFromLoginStatusChange()
        }
    }, [queryClient])

    const {
        data: user,
        isLoading,
        isError,
        error,
        refetch,
        isSuccess,
    } = useQuery<UserInformation>({
        enabled: () => AuthManager.isLoggedIn(),
        queryKey: ['user', 'me'],

        // Query function to fetch user data
        queryFn: async () => {
            return APIService.getUserInformation()
        },
        // Caching and retry configurations
        staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
        refetchOnWindowFocus: true, // Refetch when window regains focus
        retry: 1, // Retry once on failure

        placeholderData: { ...PLACEHOLDER_USER },
    })

    const isLoggedIn = useMemo(() => {
        if (loggedIn && isLoading) return loggedIn
        return Boolean(loggedIn && isSuccess && !!user?.handle && !isLoading)
    }, [loggedIn, isSuccess, user?.handle, isLoading])

    return {
        user: user ?? PLACEHOLDER_USER,
        isLoading,
        isError,
        error,
        refetch,
        isLoggedIn,
    }
}

export default useMe
