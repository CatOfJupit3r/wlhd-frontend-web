import { FC } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { FaUnlockKeyhole } from 'react-icons/fa6';

import { IconProps, UserAccountProvider } from '@models/common-types';

interface iToProviderConverters {
    provider: UserAccountProvider;
}

type iProviderToIconProps = IconProps & iToProviderConverters;
export const ProviderToIcon: FC<iProviderToIconProps> = ({ provider, ...rest }) => {
    switch (provider) {
        case 'discord':
            return <FaDiscord {...rest} />;
        case 'credential':
            return <FaUnlockKeyhole {...rest} />;
        default:
            return <FaUnlockKeyhole {...rest} />;
    }
};

interface iProviderToNameProps {
    provider: UserAccountProvider;
    className: string;
}

export const ProviderToName: FC<iProviderToNameProps> = ({ provider, className }) => {
    switch (provider) {
        case 'discord':
            return <p className={className}>Discord</p>;
        case 'credential':
            return <p className={className}>Username and Password</p>;
        default:
            return <p className={className}>Unknown</p>;
    }
};
