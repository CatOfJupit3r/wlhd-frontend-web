import useIsLoggedIn from '@hooks/useIsLoggedIn'
import paths from '@router/paths'
import APIService from '@services/APIService'
import { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apprf, checkConfirmPassword, checkHandle, checkPassword, cn } from '@utils'
import { useTranslation } from 'react-i18next'
import { useToast } from '@hooks/useToast'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Button } from '@components/ui/button'

const SignUp = ({ className }: { className?: string }) => {
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
        <div className={cn('box-border flex w-[30rem] flex-col items-center gap-4 px-16', className)}>
            <h2 className={'border-b-2 text-t-bigger'}>Create an account</h2>
            <form className={'w-full flex flex-col gap-2'}>
                <div>
                    <Label htmlFor="handle">Handle</Label>
                    <Input
                        type="text"
                        value={handle}
                        placeholder="Enter handle"
                        onChange={(e) => {
                            setHandle(e.target.value)
                        }}
                        className={'w-full'}
                    />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </div>
                <div>
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirm password"
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }}
                    />
                </div>
            </form>
            <Button
                className={cn(
                    'w-full bg-blue-800 text-white p-2 rounded-md transition-all duration-100',
                    apprf('disabled:', 'bg-blue-400 text-gray-400 cursor-not-allowed')
                )}
                onClick={(e) => onSubmit(e).then()}
                disabled={!checkInputValidity()}
            >
                Sign up!
            </Button>
            <p id={'to-signin'}>
                Already have an account?{' '}
                <Link
                    to={paths.signIn}
                    className={cn(
                        'text-blue-800 underline',
                        apprf('disabled:', 'text-gray-400 cursor-not-allowed'),
                        apprf('hover:', 'text-blue-600')
                    )}
                >
                    Sign In!
                </Link>
            </p>
        </div>
    )
}

export default SignUp
