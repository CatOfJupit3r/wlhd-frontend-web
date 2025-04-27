import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { BannerBackground } from '@components/profile/banner';
import { MutationButton } from '@components/ui/button';
import { ColorPicker } from '@components/ui/color-picker';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';
import useUpdateUserInfo from '@mutations/profile/use-update-user-info';
import useMeExtra from '@queries/use-me-extra';
import useMe from '@queries/useMe';

interface iMyAccountTab {}

const updateUserInfoSchema = z.object({
    name: z.string(),
    colors: z.object({
        primary: z.string(),
        secondary: z.string(),
    }),
});

const MyAccountTab: FC<iMyAccountTab> = () => {
    const {
        meExtra: {
            colors: { primary, secondary },
        },
    } = useMeExtra();
    const { user } = useMe();
    const { mutate, isPending } = useUpdateUserInfo();

    const form = useForm<z.infer<typeof updateUserInfoSchema>>({
        resolver: zodResolver(updateUserInfoSchema),
        defaultValues: {
            name: user.name,
            colors: {
                primary,
                secondary,
            },
        },
    });

    const onSubmit = useCallback(
        (values: z.infer<typeof updateUserInfoSchema>) => {
            if (JSON.stringify(values) !== JSON.stringify({ name: user.name, colors: { primary, secondary } })) {
                mutate(values);
            }
        },
        [user, primary, secondary],
    );

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">My Account</h2>
            <p className="text-sm text-muted-foreground">Manage your account information and preferences</p>

            <Form {...form}>
                <form className="mt-6 gap-2 space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className={'w-1/2'}>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <FormControl>
                                    <Input className="w-full" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your public display name. When you first join lobby, this name will be used as your
                                    first nickname. Note: Changing this name won't change your nicknames
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="colors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="colors">Primary and Secondary Colors</FormLabel>
                                <FormDescription>
                                    Primary and secondary colors are used for the banner and the background of the
                                    website. Use color pickers directly on the banner to change the colors and see how
                                    they would look like!
                                </FormDescription>
                                <div className={'relative h-48 w-full'} id={'colors-preview'}>
                                    <BannerBackground colors={field.value}>
                                        <FormControl>
                                            <div
                                                className={
                                                    'z-10 mx-6 flex w-full flex-row items-center justify-between gap-1'
                                                }
                                            >
                                                <ColorPicker
                                                    className={'rounded-xl border-4 duration-0'}
                                                    onChange={(v) => {
                                                        field.onChange({
                                                            primary: v,
                                                            secondary: field.value.secondary,
                                                        });
                                                    }}
                                                    value={field.value.primary}
                                                />
                                                <ColorPicker
                                                    className={'rounded-xl border-4 duration-0'}
                                                    onChange={(v) => {
                                                        field.onChange({
                                                            primary: field.value.primary,
                                                            secondary: v,
                                                        });
                                                    }}
                                                    value={field.value.secondary}
                                                />
                                            </div>
                                        </FormControl>
                                    </BannerBackground>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <MutationButton
                        type={'submit'}
                        variant="default"
                        size="sm"
                        isPending={isPending}
                        disabled={!form.formState.isValid}
                        mutate={() => form.handleSubmit(onSubmit)()}
                    >
                        Save Changes
                    </MutationButton>
                </form>
            </Form>
        </div>
    );
};

export default () => {
    const { isPending: extraPending } = useMeExtra();
    const { isLoading: mePending } = useMe();

    if (extraPending || mePending) return null;

    return <MyAccountTab />;
};
