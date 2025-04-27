import { FC, ReactNode } from 'react';

import { PulsatingSkeleton } from '@components/ui/skeleton';
import type { UserAccountProvider, UserAccountType } from '@models/common-types';

import { ProviderToIcon, ProviderToName } from './account-info-display-helpers';

export interface iAccountInfoPanel {
    account: Pick<UserAccountType, 'scopes'> & { provider: UserAccountProvider };
    children?: ReactNode;
}

export const AccountInfoPanelSkeleton: FC = () => {
    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
                <PulsatingSkeleton className="size-5" />
                <div>
                    <PulsatingSkeleton className="h-4 w-24" />
                    <PulsatingSkeleton className="mt-1 h-2 w-16" />
                </div>
            </div>
            <div className={'flex flex-row gap-2'} id={'account-info-panel-actions'}>
                <PulsatingSkeleton className="h-5 w-20" />
            </div>
        </div>
    );
};

const AccountInfoPanel: FC<iAccountInfoPanel> = ({ account, children }) => {
    return (
        <div className="flex h-full items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
                <ProviderToIcon provider={account.provider} className={'size-5'} />
                <div>
                    <ProviderToName provider={account.provider} className="font-medium" />
                    {account.scopes.length ? (
                        <p className="text-xs text-muted-foreground">Scopes: {account.scopes.join(', ') || 'None?'}</p>
                    ) : null}
                </div>
            </div>
            <div className={'flex flex-row gap-2'} id={'account-info-panel-actions'}>
                {children}
            </div>
        </div>
    );
};

export default AccountInfoPanel;
