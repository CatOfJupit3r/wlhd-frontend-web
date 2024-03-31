import EventEmitter from 'events'
import { jwtDecode } from 'jwt-decode'

class AuthManager {
    accessTokenKey = 'WALENHOLDE_ACCESS_TOKEN'

    refreshTokenKey = 'WALENHOLDE_REFRESH_TOKEN'

    emitter = new EventEmitter()

    eventTypes = {
        LOGIN_STATUS_CHANGED: 'LOGIN_STATUS_CHANGED',
        LOGIN: 'LOGIN',
        LOGOUT: 'LOGOUT',
    }

    isLoggedIn() {
        const token = this.getAccessToken()
        return !!token
    }

    isAccessTokenExpired = () => {
        const token = this.getAccessToken()
        if (!token) return true

        const decoded = jwtDecode(token)
        const expirationDate = decoded.exp
        if (!expirationDate) return true
        return new Date().getTime() >= expirationDate * 1000
    }

    getAccessToken() {
        return localStorage.getItem(this.accessTokenKey)
    }

    setAccessToken(accessToken: string) {
        localStorage.setItem(this.accessTokenKey, accessToken)
    }

    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey)
    }

    setRefreshToken(refreshToken: string) {
        localStorage.setItem(this.refreshTokenKey, refreshToken)
    }

    login({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
        this.setAccessToken(accessToken)
        this.setRefreshToken(refreshToken)

        this.emitter.emit(this.eventTypes.LOGIN_STATUS_CHANGED, true)
        this.emitter.emit(this.eventTypes.LOGIN)
    }

    logout() {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)

        this.emitter.emit(this.eventTypes.LOGIN_STATUS_CHANGED, false)
        this.emitter.emit(this.eventTypes.LOGOUT)
    }

    onLoginStatusChange(cb: (isLoggedIn: boolean) => void): () => void {
        this.emitter.on(this.eventTypes.LOGIN_STATUS_CHANGED, cb)

        return () => {
            this.emitter.off(this.eventTypes.LOGIN_STATUS_CHANGED, cb)
        }
    }

    onLogin(cb: (isLoggedIn: boolean) => void): () => void {
        this.emitter.on(this.eventTypes.LOGIN, cb)

        return () => {
            this.emitter.off(this.eventTypes.LOGIN, cb)
        }
    }

    onLogout(cb: (isLoggedIn: boolean) => void): () => void {
        this.emitter.on(this.eventTypes.LOGOUT, cb)

        return () => {
            this.emitter.off(this.eventTypes.LOGOUT, cb)
        }
    }
}

export default new AuthManager()
