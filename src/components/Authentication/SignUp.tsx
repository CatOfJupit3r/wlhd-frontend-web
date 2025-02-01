import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import StyledLink from '@components/ui/styled-link';
import { useToast } from '@hooks/useToast';
import useMe from '@queries/useMe';
import paths from '@router/paths';
import APIService from '@services/APIService';
import { apprf, checkConfirmPassword, checkHandle, checkPassword, cn } from '@utils';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const SignUp = ({ className }: { className?: string }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { toastError } = useToast();

    const [handle, setHandle] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { isLoggedIn, isLoading } = useMe();

    useEffect(() => {
        if (!isLoggedIn || isLoading) return;
        navigate(paths.profile);
    }, [isLoggedIn, isLoading]);

    const checkInputValidity = useCallback(() => {
        for (const check of [
            checkHandle(handle),
            checkPassword(password),
            checkConfirmPassword(password, confirmPassword),
        ]) {
            const { valid } = check;
            if (!valid) {
                return false;
            }
        }
        return true;
    }, [password, handle, confirmPassword]);

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!handle || !password) {
            toastError({ title: t('local:error'), description: t('local:missingParameters') });
            return;
        } else if (password !== confirmPassword) {
            toastError({ title: t('local:error'), description: t('local:passwordsDoNotMatch') });
            return;
        }

        try {
            await APIService.createAccount(handle, password);
        } catch (err) {
            if (err && err instanceof AxiosError) {
                toastError({ title: t('local:error'), description: err.response?.data.message });
            } else if (err && err instanceof Error) {
                toastError({ title: t('local:error'), description: err.message });
            }
            console.log('Error: ', err);
        }
    };

    return (
        <div className={cn('box-border flex w-[30rem] flex-col items-center gap-4 px-16', className)}>
            <h2 className={'text-3.5xl border-b-2'}>Create an account</h2>
            <form className={'flex w-full flex-col gap-2'}>
                <div>
                    <Label htmlFor="handle">Handle</Label>
                    <Input
                        type="text"
                        value={handle}
                        placeholder="Enter handle"
                        onChange={(e) => {
                            setHandle(e.target.value);
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
                            setPassword(e.target.value);
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
                            setConfirmPassword(e.target.value);
                        }}
                    />
                </div>
            </form>
            <Button
                className={cn(
                    'w-full rounded-md bg-blue-800 p-2 text-white transition-all duration-100',
                    apprf('disabled:', 'cursor-not-allowed bg-blue-400 text-gray-400'),
                )}
                onClick={(e) => onSubmit(e).then()}
                disabled={!checkInputValidity()}
            >
                Sign up!
            </Button>
            <p id={'to-signin'}>
                Already have an account?{' '}
                <StyledLink
                    to={paths.signIn}
                    className={cn(
                        'text-blue-800 underline',
                        apprf('disabled:', 'cursor-not-allowed text-gray-400'),
                        apprf('hover:', 'text-blue-600'),
                    )}
                >
                    Sign In!
                </StyledLink>
            </p>
        </div>
    );
};

export default SignUp;
