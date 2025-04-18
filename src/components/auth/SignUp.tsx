import { Button } from '@components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@components/ui/form';
import { Input } from '@components/ui/input';
import StyledLink from '@components/ui/styled-link';
import { zodResolver } from '@hookform/resolvers/zod';
import useRegister from '@mutations/auth/useRegister';
import useMe from '@queries/useMe';
import { useNavigate } from '@tanstack/react-router';
import { apprf, cn } from '@utils';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const registerSchema = z
    .object({
        username: z
            .string()
            .min(4)
            .max(20)
            .regex(/^[a-zA-Z0-9_]+$/),
        password: z
            .string()
            .min(5)
            .max(20)
            .regex(/^[a-zA-Z0-9_]+$/),
        confirmPassword: z
            .string()
            .min(5)
            .max(20)
            .regex(/^[a-zA-Z0-9_]+$/),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match!',
        path: ['confirmPassword'],
    });

const SignUp = ({ className }: { className?: string }) => {
    'use no memo;';
    const { t } = useTranslation('local', {
        keyPrefix: 'auth',
    });
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
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
            <Form {...form}>
                <form className={'flex w-full flex-col gap-2'}>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="username">{t('username.index')}</FormLabel>
                                <FormDescription>{t('username.description')}</FormDescription>
                                <FormControl>
                                    <Input className={'w-full'} placeholder={t('username.placeholder')} {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="password">{t('password.index')}</FormLabel>
                                <FormDescription>{t('password.description')}</FormDescription>
                                <FormControl>
                                    <Input
                                        className={'w-full'}
                                        placeholder={t('password.placeholder')}
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="confirm-password">{t('confirm-password.index')}</FormLabel>
                                <FormControl>
                                    <Input
                                        className={'w-full'}
                                        placeholder={t('confirm-password.placeholder')}
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
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
