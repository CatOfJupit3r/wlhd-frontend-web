import { useEffect, useState } from 'react'
import AuthManager from '../services/AuthManager'

export const useIsLoggedIn = () => {
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
    return loggedIn
}
