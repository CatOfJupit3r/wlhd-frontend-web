import { Alert, AlertDescription } from '@components/ui/alert';
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
import { Button } from '@components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { FC } from 'react';
import { LuTriangleAlert } from 'react-icons/lu';

interface iDangerZoneTab {}

const DangerZoneTab: FC<iDangerZoneTab> = () => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">Actions here can't be undone. Please proceed with caution.</p>

            <div className="mt-6 space-y-6">
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <LuTriangleAlert className="h-4 w-4" />
                    <AlertDescription>
                        The actions in this section are permanent and cannot be reversed.
                    </AlertDescription>
                </Alert>

                {/* Account Deactivation */}
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-base">Deactivate Account</CardTitle>
                        <CardDescription>
                            Temporarily disable your account. You can reactivate anytime by logging in.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" className="text-destructive">
                            Deactivate Account
                        </Button>
                    </CardFooter>
                </Card>

                {/* Data Deletion */}
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-base">Delete All Data</CardTitle>
                        <CardDescription>
                            Remove all your personal data while keeping your account active.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" className="text-destructive">
                            Delete All My Data
                        </Button>
                    </CardFooter>
                </Card>

                {/* Account Deletion */}
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
                                    <Button variant="destructive">Delete Account</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default DangerZoneTab;
