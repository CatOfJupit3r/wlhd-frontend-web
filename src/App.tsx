import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";

function App() {
    const { t }  = useTranslation()
    return (
        <BrowserRouter>
            <div className={"App"}>
                <Routes>
                    <Route path={"/"} element={<MainLayout/>}>
                        <Route index element={<HomePage/>}/>
                        <Route path="about" element={<AboutPage/>}/>
                    </Route>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
