import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import Notify from '../components/Notify'
import Footer from '../components/Footer/Footer'

const MainLayout = ({ includeHeader, includeFooter }: { includeHeader?: boolean, includeFooter?: boolean }) => {
    return (
        <>
            {includeHeader && <Header />}
            <Notify />
            <Outlet />
            {includeFooter && <Footer />}
        </>
    )
}

export default MainLayout
