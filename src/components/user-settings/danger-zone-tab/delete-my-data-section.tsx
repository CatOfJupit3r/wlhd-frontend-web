import { FC } from 'react';

import { toastInfo } from '@components/toastifications';
import { Button } from '@components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';

interface iDeleteMyDataSection {}

const DeleteMyDataSection: FC<iDeleteMyDataSection> = () => {
    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-base">Delete All Data</CardTitle>
                <CardDescription>Remove all your personal data while keeping your account active.</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button
                    variant="outline"
                    className="text-destructive"
                    onClick={() => {
                        toastInfo(
                            'Success!',
                            'Walenholde Combat Project does not collect any extra data about you, so there is nothing to delete :>',
                        );
                    }}
                >
                    Delete All My Data
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DeleteMyDataSection;
