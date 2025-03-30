import EventEmitter from 'events';
import { jwtDecode } from 'jwt-decode';

export const LOGIN_STATUS = {
    LOGGED_IN: 'logged-in',
    LOGGED_OUT: 'logged-out',
};
export type eLoginStatus = (typeof LOGIN_STATUS)[keyof typeof LOGIN_STATUS];

class AuthManager {
    accessTokenKey = 'WALENHOLDE_ACCESS_TOKEN';
    refreshTokenKey = 'WALENHOLDE_REFRESH_TOKEN';
    emitter = new EventEmitter();

    eventTypes = {
        LOGIN_STATUS_CHANGED: 'LOGIN_STATUS_CHANGED',
    };

    isLoggedIn() {
        const token = this.getAccessToken();
        return !!token;
    }

    isAccessTokenExpired = () => {
        const token = this.getAccessToken();
        if (!token) return true;

        const decoded = jwtDecode(token);
        const expirationDate = decoded.exp;
        if (!expirationDate) return true;
        return new Date().getTime() >= expirationDate * 1000;
    };

    getAccessToken() {
        return '123';
    }

    setAccessToken(accessToken: string) {
        localStorage.setItem(this.accessTokenKey, accessToken);
    }

    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }

    setRefreshToken(refreshToken: string) {
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    login({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);

        this.emitter.emit(this.eventTypes.LOGIN_STATUS_CHANGED, LOGIN_STATUS.LOGGED_IN);
    }

    logout() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);

        this.emitter.emit(this.eventTypes.LOGIN_STATUS_CHANGED, LOGIN_STATUS.LOGGED_OUT);
    }
}

export default new AuthManager();
