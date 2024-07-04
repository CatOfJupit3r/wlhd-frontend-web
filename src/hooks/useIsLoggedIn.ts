import AuthManager from '@services/AuthManager'
import { useEffect, useState } from 'react'

const useIsLoggedIn = () => {
    const [loggedIn, setLoggedIn] = useState(AuthManager.isLoggedIn())

    useEffect(() => {
        const unsubscribeFromLoginStatusChange = AuthManager.onLoginStatusChange((token) => {
            setLoggedIn(token)
        })
        const unsubscribeFromOnLogin = AuthManager.onLogin(() => {
            console.log('User was logged in!')
        })
        return () => {
            unsubscribeFromLoginStatusChange()
            unsubscribeFromOnLogin()
        }
    }, [])

    return {
        isLoggedIn: loggedIn,
    }
}

export default useIsLoggedIn
