import { usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { VITE_BACKEND_URL } from 'config';

const authClient = createAuthClient({
    baseURL: VITE_BACKEND_URL,
    basePath: '/auth',
    plugins: [usernameClient()],
});

export default authClient;
