import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import { useTranslation } from "react-i18next";

function App() {
    const { t }  = useTranslation()
    return (
        <Router>
            <div>
                {/*<Header/>*/}
                <h1>{t("brrruhhh")}</h1>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
