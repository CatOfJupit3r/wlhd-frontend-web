import { VITE_BACKEND_URL } from '@configuration';
import { usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

const DEFAULT_INSTANCE = () => {
    return createAuthClient({
        baseURL: VITE_BACKEND_URL,
        basePath: '/auth',
        plugins: [usernameClient()],
        fetchOptions: {
            throw: true,
        },
    });
};

export type AuthInstanceType = ReturnType<typeof DEFAULT_INSTANCE>;

class AuthService {
    private static instance: AuthInstanceType | null = null;

    public static setup(client?: AuthInstanceType) {
        if (!client) {
            AuthService.instance = DEFAULT_INSTANCE();
        } else {
            AuthService.instance = client;
        }
    }

    public static getInstance() {
        if (!AuthService.instance) {
            AuthService.setup();
        }
        return AuthService.instance as NonNullable<typeof AuthService.instance>;
    }

    public static getSession() {
        return AuthService.getInstance().getSession({ fetchOptions: { throw: true } });
    }
}

export type InternalAuthSession = AuthInstanceType['$Infer']['Session'];

export default AuthService;
