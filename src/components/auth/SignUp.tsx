import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { registerSchema } from '@components/auth/schemas';
import { SignUpForm } from '@components/auth/sign-up-form';
import { Button } from '@components/ui/button';
import StyledLink from '@components/ui/styled-link';
import useRegister from '@mutations/auth/useRegister';
import useMe from '@queries/useMe';
import { apprf, cn } from '@utils';

const SignUp = ({ className }: { className?: string }) => {
    'use no memo;';
    const { t } = useTranslation('local', {
        keyPrefix: 'auth',
    });
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: 'someuser',
            password: '1234567890',
            confirmPassword: '1234567890',
        },
    });
    const navigate = useNavigate();
    const { isLoading, isLoggedIn } = useMe();
    const { mutate, isPending, isSuccess } = useRegister();

    useEffect(() => {
        if (isSuccess || (!isLoading && isLoggedIn)) {
            navigate({
                to: '/profile',
            });
        }
    }, [isSuccess, isLoading, isLoggedIn]);

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        mutate(values);
    };

    return (
        <div className={cn('box-border flex w-[30rem] flex-col items-center gap-4 px-16', className)}>
            <h2 className={'text-3.5xl border-b-2'}>{t('sign-up.title')}</h2>
            <SignUpForm form={form} />
            <Button
                className={cn(
                    'w-full rounded-md bg-blue-800 p-2 text-white transition-all duration-100',
                    apprf('disabled:', 'cursor-not-allowed bg-blue-400 text-gray-400'),
                )}
                onClick={(_) => form.handleSubmit(onSubmit)()}
                disabled={isPending || !form.formState.isValid}
            >
                {t('sign-up.submit')}
            </Button>
            <p id={'to-signin'}>
                {t('sign-up.footer')}{' '}
                <StyledLink
                    to={'/login'}
                    className={cn(
                        'text-blue-800 underline',
                        apprf('disabled:', 'cursor-not-allowed text-gray-400'),
                        apprf('hover:', 'text-blue-600'),
                    )}
                >
                    {t('sign-up.footer-link')}
                </StyledLink>
            </p>
        </div>
    );
};

export default SignUp;
