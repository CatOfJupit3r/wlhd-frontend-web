import { zodResolver } from '@hookform/resolvers/zod';
import { UserAccountProvider } from '@type-defs/common-types';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { FaUnlink } from 'react-icons/fa';
import { MdOutlineSettingsInputComponent } from 'react-icons/md';
import { PiPlugsConnectedBold } from 'react-icons/pi';
import { z } from 'zod';

import { PASSWORD_REGEX, registerSchema } from '@components/auth/schemas';
import { SignUpForm } from '@components/auth/sign-up-form';
import { Button, MutationButton } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogInteractableArea,
    DialogTitle,
    DialogTrigger,
} from '@components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';
import useAddCredentialAuth from '@mutations/profile/use-add-credential-auth';
import useChangePassword from '@mutations/profile/use-change-password';
import useLinkAccount from '@mutations/profile/use-link-social';
import useUnlinkAccount from '@mutations/profile/use-unlink-account';

interface iUnlinkConnectedAccountButtonProps {
    removable: boolean;
    provider: UserAccountProvider;
}

interface iConnectedAccountActionsProps extends iUnlinkConnectedAccountButtonProps {}

export const ConnectedAccountActions: FC<iConnectedAccountActionsProps> = ({ removable, provider }) => {
    return (
        <div className={'flex flex-row gap-2 max-xl:flex-col'}>
            <ManageAccount provider={provider} />
            <UnlinkConnectedAccountButton removable={removable} provider={provider} />
        </div>
    );
};

// UNLINK

const UnlinkConnectedAccountButton: FC<iUnlinkConnectedAccountButtonProps> = ({ removable, provider }) => {
    const { mutate, isPending } = useUnlinkAccount();

    return (
        <MutationButton
            variant="outline-destructive"
            className={'w-28'}
            size="sm"
            disabled={!removable}
            mutate={() => mutate({ provider })}
            isPending={isPending}
        >
            <FaUnlink className="mr-2 size-3 max-lg:mr-0" />
            <p className={'opacity-100 transition-opacity max-lg:hidden max-lg:opacity-0'}>Unlink</p>
        </MutationButton>
    );
};

// MANAGE

const changePasswordSchema = z
    .object({
        oldPassword: z.string().min(8).regex(PASSWORD_REGEX),
        newPassword: z.string().min(8).regex(PASSWORD_REGEX),
        confirmNewPassword: z.string().min(8).regex(PASSWORD_REGEX),
        revokeOtherSessions: z.boolean(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Passwords do not match!',
        path: ['confirmPassword'],
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
        message: 'New password must be different from old password!',
        path: ['newPassword'],
    });

const ManageCredentialLinkedAccount: FC = () => {
    'use no memo;';
    const { mutate, isPending } = useChangePassword();
    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            revokeOtherSessions: true,
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
        mutate({
            currentPassword: values.oldPassword,
            newPassword: values.newPassword,
            revokeOtherSessions: values.revokeOtherSessions,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'outline-default'} size="sm" className={'w-28 justify-center'}>
                    <MdOutlineSettingsInputComponent className={'mr-2 size-3 max-lg:mr-0'} />
                    <p className={'opacity-100 transition-opacity max-lg:hidden max-lg:opacity-0'}>Manage</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Credential Linked Account</DialogTitle>
                    <DialogDescription>You can change your password, if you want too</DialogDescription>
                </DialogHeader>
                <DialogInteractableArea>
                    <Form {...form}>
                        <form className={'flex flex-col gap-3'}>
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                className={'w-full'}
                                                placeholder={'Enter your old password'}
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="newPassword">New Password</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                className={'w-full'}
                                                placeholder={'Enter your old password'}
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmNewPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="confirmNewPassword">Confirm your new password</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                className={'w-full'}
                                                placeholder={'Enter your old password'}
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={'revokeOtherSessions'}
                                render={({ field }) => (
                                    <FormItem className={'flex flex-row items-center gap-1 space-y-0'}>
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>Revoke other active sessions (Recommended)</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </DialogInteractableArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="destructive" size="sm" className={'w-24'}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <MutationButton
                        size="sm"
                        className={'w-24'}
                        mutate={() => form.handleSubmit(onSubmit)()}
                        type={'submit'}
                        isPending={isPending}
                        disabled={!form.formState.isValid}
                    >
                        Change
                    </MutationButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const ManageAccount: FC<Pick<iConnectedAccountActionsProps, 'provider'>> = ({ provider }) => {
    switch (provider) {
        case 'credential':
            return <ManageCredentialLinkedAccount />;
        default:
            return null;
    }
};

// CONNECT

interface iConnectOauthAccountProps {
    provider: UserAccountProvider;
}

const ConnectOauthAccountDialogCredential: FC = () => {
    'use no memo;';
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
    });
    const { mutate, isPending } = useAddCredentialAuth();

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        mutate(values);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Connect Username Authorization</DialogTitle>
                <DialogDescription>
                    Please enter your username and password to connect your account. You will use them when logging in.
                </DialogDescription>
            </DialogHeader>
            <DialogInteractableArea>
                <SignUpForm form={form} />
            </DialogInteractableArea>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="destructive" size="sm">
                        Cancel
                    </Button>
                </DialogClose>
                <MutationButton
                    type={'submit'}
                    variant="default"
                    size="sm"
                    isPending={isPending}
                    disabled={!form.formState.isValid}
                    mutate={() => form.handleSubmit(onSubmit)()}
                >
                    Connect
                </MutationButton>
            </DialogFooter>
        </DialogContent>
    );
};

const ConnectOauthAccountDiscordButton: FC = () => {
    const { mutate, isPending } = useLinkAccount();

    return (
        <MutationButton
            variant="default"
            size="sm"
            isPending={isPending}
            mutate={() => mutate({ provider: 'discord' })}
        >
            <PiPlugsConnectedBold className={'mr-2 size-4'} />
            Connect
        </MutationButton>
    );
};

export const ConnectOauthAccount: FC<iConnectOauthAccountProps> = ({ provider }) => {
    switch (provider) {
        case 'credential': {
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={'outline'} size="sm">
                            <PiPlugsConnectedBold className={'mr-2 size-4'} />
                            Connect
                        </Button>
                    </DialogTrigger>
                    <ConnectOauthAccountDialogCredential />
                </Dialog>
            );
        }
        case 'discord':
            return <ConnectOauthAccountDiscordButton />;
        default: {
            return (
                <Button disabled={true}>
                    <PiPlugsConnectedBold className={'mr-2 size-4'} />
                    Connect
                </Button>
            );
        }
    }
};
