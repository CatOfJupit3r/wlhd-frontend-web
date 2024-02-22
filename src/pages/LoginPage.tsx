import React, {useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import queryString from "query-string";

const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const parsedQuery = queryString.parse(location.search);

    const {nickname} = parsedQuery as {nickname: string};

    const redirect = () => {
        console.log(location.search);
        if (nickname === undefined) {
            navigate("..");
        } else {
            navigate("../game");
        }
        return <p>Redirecting...</p>
    }

    useEffect(() => {
        redirect();
    });

    return (
        <div>
        <h1>Login Page</h1>
        </div>
    )
};

export default LoginPage;