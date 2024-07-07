import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { AppDispatch } from '@redux/store'
import paths from '@router/paths'
import APIService from '@services/APIService'
import { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../Authentication.module.css'
import { checkHandle, checkPassword } from '@utils/verifyInputs'
import { useToast } from '@hooks/useToast'

const SignIn = ({ style }: { style?: React.CSSProperties }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { toastError } = useToast()

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
            toastError({
                title: 'local:error',
                description: 'local:error.missingParams',
            })
            return
        }

        try {
            await APIService.login(handle, password)
        } catch (err: unknown) {
            if (!err) return
            if (err instanceof AxiosError) {
                toastError({
                    title: 'local:error',
                    description: err?.response?.data.message || 'local:error.connectionError',
                })
            } else if (err instanceof Error) {
                toastError({
                    title: 'local:error',
                    description: err.message || 'local:error.connectionError',
                })
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
