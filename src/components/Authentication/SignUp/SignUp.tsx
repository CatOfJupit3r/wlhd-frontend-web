import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setNotify } from '../../../redux/slices/cosmeticsSlice'
import paths from '../../../router/paths'
import APIService from '../../../services/APIService'
import styles from '../Authentication.module.css'

const SignUp = ({ style }: { style?: React.CSSProperties }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [handle, setHandle] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        if (!handle || !password) {
            dispatch(setNotify({ code: 400, message: 'Missing parameters!' }))
            return
        } else if (password !== confirmPassword) {
            dispatch(setNotify({ code: 400, message: 'Passwords do not match!' }))
            return
        }

        try {
            await APIService.createAccount(handle, password)
            navigate('..')
        } catch (err) {
            if (err && err instanceof AxiosError) {
                dispatch(setNotify({ code: 400, message: err.response?.data.message }))
            } else if (err && err instanceof Error) {
                dispatch(setNotify({ code: 400, message: err.message }))
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
            <button
                className={styles.confirmBtn}
                onClick={(e) => onSubmit(e).then()}
                disabled={handle.length === 0 || password.length === 0 || confirmPassword.length === 0}
            >
                Sign up!
            </button>
            <div>
                <p>
                    Already have an account?{' '}
                    <Link to={paths.signIn} className={styles.link}>
                        Sign In!
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp
