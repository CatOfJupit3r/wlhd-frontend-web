import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { setNotify } from '@redux/slices/cosmeticsSlice'
import { AppDispatch } from '@redux/store'
import paths from '@router/paths'
import APIService from '@services/APIService'
import { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../Authentication.module.css'
import { checkHandle, checkPassword } from '../verifyInputs'

const SignIn = ({ style }: { style?: React.CSSProperties }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const [handle, setHandle] = useState('admin')
    const [password, setPassword] = useState('motherfucker')
    const [readyToNav, setReadyToNav] = useState(false)
    const { isLoggedIn } = useIsLoggedIn()

    useEffect(() => {
        if (isLoggedIn) {
            setReadyToNav(true)
        }
    }, [isLoggedIn])

    useEffect(() => {
        if (readyToNav) {
            navigate('/profile')
        }
    }, [readyToNav])

    const checkInputValidity = useCallback(() => {
        for (const check of [checkHandle(handle), checkPassword(password)]) {
            const { valid } = check
            if (!valid) {
                return false
            }
        }
        return true
    }, [password, handle])

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (!handle || !password) {
            dispatch(setNotify({ code: 400, message: 'Missing parameters!' }))
            return
        }

        try {
            await APIService.login(handle, password)
        } catch (err: unknown) {
            if (!err) return
            if (err instanceof AxiosError) {
                dispatch(setNotify({ code: 400, message: err.response?.data.message || 'Connection error!' }))
            } else if (err instanceof Error) {
                dispatch(setNotify({ code: 400, message: err.message }))
            }
        }
    }

    return (
        <div style={style} className={styles.authContainer}>
            <h2>Welcome back</h2>
            <form>
                <input
                    type="text"
                    value={handle}
                    placeholder="Handle"
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
            </form>
            <button
                type="submit"
                className={styles.confirmBtn}
                onClick={(e) => onSubmit(e).then()}
                disabled={!checkInputValidity()}
            >
                Sign In
            </button>
            <div>
                <p>
                    New around here?{' '}
                    <Link to={paths.signUp} className={styles.link}>
                        Sign up!
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignIn
