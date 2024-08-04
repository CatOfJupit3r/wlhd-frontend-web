import Footer from '@components/Footer'
import Header from '@components/Header'
import Notify from '@components/Notify'
import { Outlet } from 'react-router-dom'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { useEffect } from 'react'
import { refreshUserInfo } from '@utils'

const MainLayout = ({ includeHeader, includeFooter }: { includeHeader?: boolean; includeFooter?: boolean }) => {
    const isLoggedIn = useIsLoggedIn()

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        refreshUserInfo()
    }, [isLoggedIn])

    return (
        <>
            {includeHeader && <Header />}
            <Notify />
            <main>
                <Outlet />
            </main>
            {includeFooter && <Footer />}
        </>
    )
}

export default MainLayout
