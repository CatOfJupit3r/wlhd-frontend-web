import { LayoutContextProvider } from '@context/LayoutContext';
import useIsBackendUnavailable from '@hooks/useIsBackendUnavailable';
import PseudoPage from '@pages/PseudoPage';
import UnderMaintenanceNoDepsPage from '@pages/UnderMaintenanceNoDepsPage';
import useMe from '@queries/useMe';
import LayoutContextClient from '@router/LayoutContextClient';
import { PageWrapper } from '@router/PageWrapper';
import paths from '@router/paths';
import { FC, lazy, ReactNode, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { authRoutes, generalRoutes } from './routes';

const UnderMaintenancePage = lazy(() => import('@pages/UnderMaintenancePage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

const BackendStatusHandler: FC<{ children: ReactNode }> = ({ children }) => {
    const { isBackendUnavailable } = useIsBackendUnavailable();

    switch (isBackendUnavailable) {
        case null:
            return <PseudoPage />;
        case true:
            return (
                <Suspense fallback={<UnderMaintenanceNoDepsPage />}>
                    <UnderMaintenancePage />
                </Suspense>
            );
        case false:
            return <>{children}</>;
    }
};

const RootRouter = () => {
    const { isLoggedIn, isLoading } = useMe();

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <LayoutContextProvider>
                            <BackendStatusHandler>
                                <LayoutContextClient />
                            </BackendStatusHandler>
                        </LayoutContextProvider>
                    }
                >
                    {authRoutes.map((route) => (
                        <Route
                            path={route.path}
                            caseSensitive
                            element={
                                !isLoading ? (
                                    isLoggedIn ? (
                                        <PageWrapper config={route}>
                                            <route.Component />
                                        </PageWrapper>
                                    ) : (
                                        <Navigate to={paths.signIn} />
                                    )
                                ) : (
                                    <PseudoPage />
                                )
                            }
                            key={route.path}
                        />
                    ))}
                    {generalRoutes.map((route) => (
                        <Route
                            path={route.path}
                            caseSensitive
                            element={
                                <PageWrapper config={route}>
                                    <route.Component />
                                </PageWrapper>
                            }
                            key={route.path}
                        />
                    ))}
                </Route>
                <Route
                    path="*"
                    element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <NotFoundPage />
                        </Suspense>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default RootRouter;
