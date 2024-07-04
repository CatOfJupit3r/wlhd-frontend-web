import Footer from '@components/Footer/Footer'
import Header from '@components/Header/Header'
import Notify from '@components/Notify'
import { Outlet } from 'react-router-dom'

const MainLayout = ({ includeHeader, includeFooter }: { includeHeader?: boolean; includeFooter?: boolean }) => {
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
