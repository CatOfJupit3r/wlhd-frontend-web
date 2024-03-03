import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from "./layouts/MainLayout";
import GameRoomPage from "./pages/GameRoomPage";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <BrowserRouter>
            <div className={"App"}>
                <Routes>
                    <Route path={"/"} element={<MainLayout/>}>
                        <Route index element={<HomePage/>}/>
                        <Route path="about" element={<AboutPage/>}/>
                        <Route path="game" element={<GameRoomPage/>}/>
                        <Route path="login" element={<LoginPage/>}/>
                    </Route>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
