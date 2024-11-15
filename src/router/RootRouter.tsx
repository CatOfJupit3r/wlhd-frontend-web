import { LayoutContextProvider } from '@context/LayoutContext'
import useIsBackendUnavailable from '@hooks/useIsBackendUnavailable'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import LayoutContextClient from '@router/LayoutContextClient'
import { PageWrapper } from '@router/PageWrapper'
import paths from '@router/paths'
import { FC, lazy, ReactNode } from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter, Navigate } from 'react-router-dom'
import { authRoutes, generalRoutes } from './routes'

const UnderMaintenancePage = lazy(() => import('@pages/UnderMaintenancePage'))
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'))
const PseudoPage = lazy(() => import('@pages/PseudoPage'))

const BackendStatusHandler: FC<{ children: ReactNode }> = ({ children }) => {
    const { isBackendUnavailable } = useIsBackendUnavailable()

    switch (isBackendUnavailable) {
        case null:
            return <PseudoPage />
        case true:
            return <UnderMaintenancePage />
        case false:
            return <>{children}</>
    }
}

const RootRouter = () => {
    const { isLoggedIn } = useIsLoggedIn()

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
                            element={
                                isLoggedIn ? (
                                    <PageWrapper config={route}>
                                        <route.Component />
                                    </PageWrapper>
                                ) : (
                                    <Navigate to={paths.signIn} />
                                )
                            }
                            key={route.path}
                        />
                    ))}
                    {generalRoutes.map((route) => (
                        <Route
                            path={route.path}
                            element={
                                <PageWrapper config={route}>
                                    <route.Component />
                                </PageWrapper>
                            }
                            key={route.path}
                        />
                    ))}
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RootRouter
