import { DiscordSocialButton } from '@components/auth/socials-logins';
import { Button } from '@components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@components/ui/form';
import { Input } from '@components/ui/input';
import StyledLink from '@components/ui/styled-link';
import { zodResolver } from '@hookform/resolvers/zod';
import useLogin from '@mutations/auth/useLogin';
import useMe from '@queries/useMe';
import { useNavigate } from '@tanstack/react-router';
import { apprf, cn } from '@utils';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const loginSchema = z.object({
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
});

const SignIn = ({ className = '' }: { className?: string }) => {
    'use no memo;';
    const navigate = useNavigate();
    const { t } = useTranslation('local', {
        keyPrefix: 'auth',
    });
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: 'admin',
            password: 'motherfucker',
        },
    });
    const { isLoading, isLoggedIn } = useMe();
    const { mutate, isPending, isSuccess } = useLogin();

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate(values);
    };

    useEffect(() => {
        if (isSuccess || (!isLoading && isLoggedIn)) {
            navigate({
                to: '/profile',
            }).then();
        }
    }, [isSuccess]);

    return (
        <div className={cn('box-border flex w-[30rem] flex-col items-center gap-4 px-16', className)}>
            <h2 className={'text-3.5xl border-b-2'}>{t('sign-in.title')}</h2>
            <Form {...form}>
                <form className={'flex w-full flex-col gap-2'}>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="username">{t('username.index')}</FormLabel>
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
                    <Button
                        type="submit"
                        className={cn(
                            'w-full rounded-md bg-blue-800 p-2 text-white transition-all duration-100',
                            apprf('disabled:', 'cursor-not-allowed bg-blue-400 text-gray-400'),
                        )}
                        onClick={(_) => form.handleSubmit(onSubmit)()}
                        disabled={isPending || !form.formState.isValid}
                    >
                        {t('sign-in.submit')}
                    </Button>
                </form>
            </Form>
            <p>or</p>
            <div className={'flex w-full flex-col gap-2'}>
                <DiscordSocialButton thenCase={() => navigate({ to: '/profile' })} className={'w-full'}>
                    Login with Discord
                </DiscordSocialButton>
            </div>
            <div>
                <p className={'text-sm'}>
                    {t('sign-in.footer')}{' '}
                    <StyledLink
                        to={`/sign-up`}
                        className={cn(
                            'text-blue-800 underline',
                            apprf('disabled:', 'cursor-not-allowed text-gray-400'),
                            apprf('hover:', 'text-blue-600'),
                        )}
                    >
                        {t('sign-in.footer-link')}
                    </StyledLink>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
