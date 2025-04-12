import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface iRouteConfig {
    includeHeader: boolean;
    includeFooter: boolean;
}

interface LayoutContextType {
    header: boolean;
    footer: boolean;

    changeConfig: (config: Partial<iRouteConfig> | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutContextProvider = ({ children }: { children: ReactNode }) => {
    const [header, setHeader] = useState<boolean>(true);
    const [footer, setFooter] = useState<boolean>(true);

    const changeConfig = useCallback((config: Partial<iRouteConfig> | null) => {
        setHeader((prev) => (config ? config?.includeHeader : null) ?? prev);
        setFooter((prev) => (config ? config?.includeFooter : null) ?? prev);
    }, []);

    const context = useMemo(
        () => ({
            header,
            footer,
            changeConfig,
        }),
        [header, footer, changeConfig],
    );

    return <LayoutContext.Provider value={context}>{children}</LayoutContext.Provider>;
};

export const useLayoutContext = () => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayoutContext must be used within a LayoutContextProvider.');
    }
    return context as LayoutContextType;
};

/**
 * Hook that will disable footer on route.
 */
export const useNoFooter = () => {
    const { changeConfig, footer } = useLayoutContext();

    useEffect(() => {
        // Store initial state in a ref to avoid dependency issues
        const wasFooterShown = footer;

        // Only update if footer is currently shown
        if (wasFooterShown) {
            changeConfig({
                includeFooter: false,
            });
        }

        // Clean-up function
        return () => {
            // Only restore if footer was initially shown
            if (wasFooterShown) {
                changeConfig({
                    includeFooter: true,
                });
            }
        };
    }, []); // Empty dependency array - run only on mount/unmount
};

/**
 * Hook that will disable header on route.
 */
export const useNoHeader = () => {
    const { changeConfig, header } = useLayoutContext();

    useEffect(() => {
        // Store initial state in a ref to avoid dependency issues
        const wasHeaderShown = header;

        // Only update if header is currently shown
        if (wasHeaderShown) {
            changeConfig({
                includeHeader: false,
            });
        }

        // Clean-up function
        return () => {
            // Only restore if header was initially shown
            if (wasHeaderShown) {
                changeConfig({
                    includeHeader: true,
                });
            }
        };
    }, []); // Empty dependency array - run only on mount/unmount
};

/**
 * Hook that will disable both header and footer on route.
 *
 * Composes useNoFooter and useNoHeader, so you can use it as a single hook.
 */
export const useNoFooterOrHeader = () => {
    useNoFooter();
    useNoHeader();
};
