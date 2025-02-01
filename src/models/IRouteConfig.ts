import { ComponentType, LazyExoticComponent } from 'react';

export interface iRouteConfig {
    path: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component: LazyExoticComponent<ComponentType<any>>;
    requiresAuth?: boolean;
    devOnly?: boolean;
    title: string;
    includeHeader?: boolean;
    includeFooter?: boolean;
    requiresLobbyInfo?: boolean;
}
