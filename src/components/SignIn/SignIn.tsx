import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { setNotify } from '../../redux/slices/cosmeticsSlice'
import APIService from '../../services/APIService'
import { AxiosError } from 'axios'

const SignIn = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const [handle, setHandle] = useState('admin')
    const [password, setPassword] = useState('motherfucker')
    const [readyToNav, setReadyToNav] = useState(false)

    const onSubmit = async () => {
        if (!handle || !password) {
            dispatch(setNotify({ code: 400, message: 'Missing parameters!' }))
            return
        }

        try {
            await APIService.login(handle, password)
            setReadyToNav(true)
        } catch (err) {
            if (err && err instanceof AxiosError) {
                dispatch(setNotify({ code: 400, message: err.response?.data.message || 'Connection error!' }))
            } else if (err && err instanceof Error) {
                dispatch(setNotify({ code: 400, message: err.message }))
            }
            console.log('Error: ', err)
        }
    }

    useEffect(() => {
        if (readyToNav) {
            navigate('/profile')
        }
    }, [readyToNav])

    return (
        <div>
            <h1>Login Page</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit().then()
                }}
            >
                <input
                    type="text"
                    value={handle}
                    placeholder="Enter handle"
                    onChange={(e) => {
                        setHandle(e.target.value)
                    }}
                />
                <input
                    type="password"
                    value={password}
                    placeholder="Enter password"
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default SignIn