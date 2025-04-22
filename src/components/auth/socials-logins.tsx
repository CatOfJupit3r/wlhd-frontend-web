import { AwaitingButton, iAwaitingButtonProps } from '@components/ui/button';
import { Route as ProfileRoute } from '@router/_auth_only';
import AuthService from '@services/AuthService';
import { cn } from '@utils';
import { clientAbsoluteLink } from '@utils/client-absolute-link';
import { CSSProperties, FC } from 'react';
import { FaDiscord } from 'react-icons/fa';

type BetterAuthSocialProviders = Parameters<
    ReturnType<typeof AuthService.getInstance>['signIn']['social']
>[0]['provider'];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SUPPORTED_PROVIDERS: Array<BetterAuthSocialProviders> = ['discord'];
type SupportedSocialProviders = (typeof SUPPORTED_PROVIDERS)[number];

interface SocialLoginButtonProps extends iAwaitingButtonProps {
    provider: SupportedSocialProviders;
}

type ConcreteSocialLoginButtonProps = Omit<SocialLoginButtonProps, 'provider'>;

const SocialLoginButton: FC<SocialLoginButtonProps> = ({ provider, ...props }) => {
    return (
        <AwaitingButton
            {...props}
            onClick={() =>
                AuthService.getInstance().signIn.social({
                    provider,
                    callbackURL: clientAbsoluteLink(ProfileRoute.to),
                })
            }
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
