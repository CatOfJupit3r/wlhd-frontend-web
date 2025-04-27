import { Alert, AlertDescription } from '@components/ui/alert';
import { FC } from 'react';
import { LuTriangleAlert } from 'react-icons/lu';

import DeleteAccountSection from './delete-account-section';
import DeleteMyDataSection from './delete-my-data-section';

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
                <div className={'grid grid-cols-2 gap-6'}>
                    <DeleteMyDataSection />
                    <DeleteAccountSection />
                </div>
            </div>
        </div>
    );
};

export default DangerZoneTab;
