import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@components/ui/alert-dialog';
import { Button, MutationButton } from '@components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import useDeleteUser from '@mutations/profile/use-delete-user';
import { Route as IndexRoute } from '@router/index';
import { FC } from 'react';

interface iDeleteAccountSection {}

const DeleteAccountSection: FC<iDeleteAccountSection> = () => {
    const { mutate, isPending } = useDeleteUser({ to: IndexRoute.to });

    return (
        <AlertDialog>
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-base">Delete Account</CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Permanently Delete Account</Button>
                    </AlertDialogTrigger>
                </CardFooter>
            </Card>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        Are you sure you want to permanently delete your account and all associated data?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <MutationButton variant="destructive" mutate={mutate} isPending={isPending}>
                                Delete Account
                            </MutationButton>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAccountSection;
