import { Button } from '@components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@components/ui/form';
import { Input } from '@components/ui/input';
import StyledLink from '@components/ui/styled-link';
import { zodResolver } from '@hookform/resolvers/zod';
import useLogin from '@mutations/auth/useLogin';
import useMe from '@queries/useMe';
import paths from '@router/paths';
import { apprf, cn } from '@utils';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { z } from 'zod';

const loginSchema = z.object({
    handle: z
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
            handle: 'admin',
            password: 'motherfucker',
        },
    });
    const { mutate, isPending } = useLogin();
    const { isLoggedIn, isLoading } = useMe();

    useEffect(() => {
        if (!isLoggedIn || isLoading) return;
        navigate(paths.profile);
    }, [isLoggedIn, isLoading]);

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate(values);
    };

    return (
        <div className={cn('box-border flex w-[30rem] flex-col items-center gap-4 px-16', className)}>
            <h2 className={'text-3.5xl border-b-2'}>{t('sign-in.title')}</h2>
            <Form {...form}>
                <form className={'flex w-full flex-col gap-2'}>
                    <FormField
                        control={form.control}
                        name="handle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="handle">{t('handle.index')}</FormLabel>
                                <FormControl>
                                    <Input className={'w-full'} placeholder={t('handle.placeholder')} {...field} />
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
            <div>
                <p>
                    {t('sign-in.footer')}{' '}
                    <StyledLink
                        to={paths.signUp}
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
