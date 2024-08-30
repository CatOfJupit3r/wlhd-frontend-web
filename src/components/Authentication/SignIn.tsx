import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { useToast } from '@hooks/useToast'
import { AppDispatch } from '@redux/store'
import paths from '@router/paths'
import APIService from '@services/APIService'
import { apprf, checkHandle, checkPassword, cn } from '@utils'
import { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const SignIn = ({ className = '' }: { className?: string }) => {
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
            navigate(paths.profile)
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
        <div className={cn('box-border flex w-[30rem] flex-col items-center gap-4 px-16', className)}>
            <h2 className={'border-b-2 text-t-bigger'}>Welcome back</h2>
            <form className={'flex w-full flex-col items-center gap-2'}>
                <div className={'w-full'}>
                    <Label htmlFor={'login'}>Handle</Label>
                    <Input value={handle} placeholder="Enter handle" onChange={(e) => setHandle(e.target.value)} />
                </div>
                <div className={'w-full'}>
                    <Label htmlFor={'password'}>Password</Label>
                    <Input
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        className={'w-full'}
                    />
                </div>
            </form>
            <Button
                type="submit"
                className={cn(
                    'w-full rounded-md bg-blue-800 p-2 text-white transition-all duration-100',
                    apprf('disabled:', 'cursor-not-allowed bg-blue-400 text-gray-400')
                )}
                onClick={(e) => onSubmit(e).then()}
                disabled={!checkInputValidity()}
            >
                Sign In
            </Button>
            <div>
                <p>
                    New around here?{' '}
                    <Link
                        to={paths.signUp}
                        className={cn(
                            'text-blue-800 underline',
                            apprf('disabled:', 'cursor-not-allowed text-gray-400'),
                            apprf('hover:', 'text-blue-600')
                        )}
                    >
                        Sign up!
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignIn
