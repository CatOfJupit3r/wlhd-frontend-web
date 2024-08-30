import Footer from '@components/Footer'
import Header from '@components/Header'
import Notify from '@components/Notify'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { refreshUserInfo } from '@utils'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

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
            <main>
                <Outlet />
            </main>
            <Notify />
            {includeFooter && <Footer />}
        </>
    )
}

export default MainLayout
