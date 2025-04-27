import { CSSProperties, FC } from 'react';
import { FaDiscord } from 'react-icons/fa';

import { iAwaitingButtonProps, MutationButton } from '@components/ui/button';
import { AccountSocialProviders } from '@models/common-types';
import useSocialSignIn from '@mutations/profile/use-social-sign-in';
import { Route as ProfileRoute } from '@router/_auth_only';
import { cn } from '@utils';
import { clientAbsoluteLink } from '@utils/client-absolute-link';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SUPPORTED_PROVIDERS: Array<AccountSocialProviders> = ['discord'];
type SupportedSocialProviders = (typeof SUPPORTED_PROVIDERS)[number];

interface SocialLoginButtonProps extends iAwaitingButtonProps {
    provider: SupportedSocialProviders;
}

type ConcreteSocialLoginButtonProps = Omit<SocialLoginButtonProps, 'provider'>;

const SocialLoginButton: FC<SocialLoginButtonProps> = ({ provider, ...props }) => {
    const { mutate, isPending } = useSocialSignIn();
    return (
        <MutationButton
            {...props}
            mutate={() => {
                return mutate({
                    provider,
                    callbackURL: clientAbsoluteLink(ProfileRoute.to),
                });
            }}
            isPending={isPending}
        />
    );
};

export const DiscordSocialButton: FC<ConcreteSocialLoginButtonProps> = ({ className, children, ...props }) => {
    return (
        <SocialLoginButton
            provider="discord"
            className={cn(
                'w-full gap-2 rounded-md p-2 text-white transition-all duration-100 hover:text-black',
                className,
                'spinning-border',
            )}
            style={
                {
                    '--background-color': '#E0E3FF',
                    '--chasing-color': '#5865F2',
                } as CSSProperties
            }
            {...props}
        >
            <FaDiscord />
            {children}
        </SocialLoginButton>
    );
};
