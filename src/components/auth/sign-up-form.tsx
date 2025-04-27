import { FC, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { registerSchema } from '@components/auth/schemas';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@components/ui/form';
import { Input } from '@components/ui/input';

interface iSignUpFormProps {
    form: ReturnType<typeof useForm<z.infer<typeof registerSchema>>>;
    children?: ReactNode;
}

export const SignUpForm: FC<iSignUpFormProps> = ({ form, children }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'auth',
    });

    return (
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
                {children}
            </form>
        </Form>
    );
};
