import type { FC } from 'react';

import { Separator } from '@components/ui/separator';
import { UserAccountProvider, UserAccountType } from '@models/common-types';
import useUserAccounts from '@queries/user-settings/use-user-accounts';

import AccountInfoPanel, { AccountInfoPanelSkeleton, iAccountInfoPanel } from './account-info-panel';
import { ConnectedAccountActions } from './account-panel-actions';
import AvailableOauthProviders from './available-oauth-providers';

interface iSecurityTab {}

const SecurityTab: FC<iSecurityTab> = () => {
    const { accounts, isPending } = useUserAccounts();

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-sm text-muted-foreground">Manage your account security and linked accounts</p>

            <div className="mt-6 space-y-6">
                <Separator />

                {/* Connected Accounts */}
                <div className="space-y-4">
                    <h3 className="font-medium">Connected methods</h3>
                    <p className="text-sm text-muted-foreground">
                        Here are all of your connected login methods. You can remove or manage them here.
                    </p>

                    {!isPending ? (
                        <>
                            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                                {accounts.map((account: UserAccountType) => (
                                    <AccountInfoPanel
                                        account={account as iAccountInfoPanel['account']}
                                        key={account.id}
                                    >
                                        <ConnectedAccountActions
                                            removable={accounts.length > 1}
                                            provider={account.provider as UserAccountProvider}
                                        />
                                    </AccountInfoPanel>
                                ))}
                            </div>

                            <Separator />

                            <AvailableOauthProviders accounts={accounts} />
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <AccountInfoPanelSkeleton />
                            <AccountInfoPanelSkeleton />
                            <AccountInfoPanelSkeleton />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityTab;
