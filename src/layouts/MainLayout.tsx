import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import Notify from '../components/Notify'

const MainLayout = ({ includeHeader }: { includeHeader?: boolean }) => {
    return (
        <>
            {includeHeader && <Header />}
            <Notify />
            <Outlet />
        </>
    )
}

export default MainLayout
