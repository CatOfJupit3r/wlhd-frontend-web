import AccountInfoPanel from '@components/user-settings/security-tab/account-info-panel';
import { UserAccountProvider, UserAccountType } from '@models/common-types';
import { FC, useMemo } from 'react';
import { ConnectOauthAccount } from './account-panel-actions';

interface iExtraOauthProviders {
    accounts: UserAccountType[];
}

const ALL_OAUTH_PROVIDERS: UserAccountProvider[] = ['credential', 'discord'];

const AvailableOauthProviders: FC<iExtraOauthProviders> = ({ accounts }) => {
    const diff = useMemo(
        () => ALL_OAUTH_PROVIDERS.filter((provider) => !accounts.some((account) => account.provider === provider)),
        [accounts],
    );

    if (diff.length === 0) return null;

    return (
        <div className={'grid grid-cols-2 gap-4 max-lg:grid-cols-1'}>
            {diff.map((provider) => (
                <AccountInfoPanel
                    account={{
                        provider,
                        scopes: [],
                    }}
                    key={provider}
                >
                    <ConnectOauthAccount provider={provider} />
                </AccountInfoPanel>
            ))}
        </div>
    );
};

export default AvailableOauthProviders;
