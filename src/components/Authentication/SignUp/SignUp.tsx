import useIsLoggedIn from '@hooks/useIsLoggedIn'
import paths from '@router/paths'
import APIService from '@services/APIService'
import { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../Authentication.module.css'
import { checkConfirmPassword, checkHandle, checkPassword } from '@utils/verifyInputs'
import { useTranslation } from 'react-i18next'
import { useToast } from '@hooks/useToast'

const SignUp = ({ style }: { style?: React.CSSProperties }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { toastError } = useToast()

    const [handle, setHandle] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
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
        for (const check of [
            checkHandle(handle),
            checkPassword(password),
            checkConfirmPassword(password, confirmPassword),
        ]) {
            const { valid } = check
            if (!valid) {
                return false
            }
        }
        return true
    }, [password, handle, confirmPassword])

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (!handle || !password) {
            toastError({ title: t('local:error'), description: t('local:missingParameters') })
            return
        } else if (password !== confirmPassword) {
            toastError({ title: t('local:error'), description: t('local:passwordsDoNotMatch') })
            return
        }

        try {
            await APIService.createAccount(handle, password)
        } catch (err) {
            if (err && err instanceof AxiosError) {
                toastError({ title: t('local:error'), description: err.response?.data.message })
            } else if (err && err instanceof Error) {
                toastError({ title: t('local:error'), description: err.message })
            }
            console.log('Error: ', err)
        }
    }

    return (
        <div style={style} className={styles.authContainer}>
            <h2>Create an account</h2>
            <form>
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
                <input
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm password"
                    onChange={(e) => {
                        setConfirmPassword(e.target.value)
                    }}
                />
            </form>
            <button className={styles.confirmBtn} onClick={(e) => onSubmit(e).then()} disabled={!checkInputValidity()}>
                Sign up!
            </button>
            <p id={'to-signin'}>
                Already have an account?{' '}
                <Link to={paths.signIn} className={styles.link}>
                    Sign In!
                </Link>
            </p>
        </div>
    )
}

export default SignUp
