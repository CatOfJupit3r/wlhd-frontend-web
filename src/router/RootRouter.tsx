import { LayoutContextProvider } from '@context/LayoutContext'
import useIsBackendUnavailable from '@hooks/useIsBackendUnavailable'
import LayoutContextClient from '@router/LayoutContextClient'
import { PageWrapper } from '@router/PageWrapper'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import routes from './routes'

const UnderMaintenancePage = lazy(() => import('@pages/UnderMaintenancePage'))
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'))
const PseudoPage = lazy(() => import('@pages/PseudoPage'))

const BackendStatusHandler = () => {
    const { isBackendUnavailable } = useIsBackendUnavailable()
    if (isBackendUnavailable === null) {
        return <PseudoPage />
    } else {
        if (isBackendUnavailable === true) {
            return <UnderMaintenancePage />
        } else {
            return <Outlet />
        }
    }
}

const RootRouter = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <Suspense fallback={<PseudoPage />}>
                    <LayoutContextProvider>
                        <BackendStatusHandler />
                    </LayoutContextProvider>
                </Suspense>
            ),
            children: [
                {
                    element: <LayoutContextClient />,
                    children: routes.map((route) => ({
                        path: route.path,
                        element: (
                            <PageWrapper config={route}>
                                <route.Component />
                            </PageWrapper>
                        ),
                    })),
                },
            ],
        },
        {
            path: '*',
            element: <NotFoundPage />,
        },
    ])

    return <RouterProvider router={router} />
}

export default RootRouter
