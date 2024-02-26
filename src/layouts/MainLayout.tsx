import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import Error from "../components/Error";

const MainLayout = () => {
    return (
        <>
            <Header/>
            <Error/>
            <Outlet/>
        </>
    );
};

export default MainLayout;