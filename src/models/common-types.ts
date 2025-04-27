import type { UserAccountsReturnType } from '@queries/user-settings/use-user-accounts';
import type { LinkProps } from '@tanstack/react-router';
import { SocialProvider } from 'better-auth/social-providers';
import type { IconType } from 'react-icons';

export type RouterRoute = LinkProps['to'];
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-object-type
type MergeTypes<TypesArray extends any[], Res = {}> = TypesArray extends [infer Head, ...infer Rem]
    ? MergeTypes<Rem, Res & Head>
    : Res;
export type OneOf<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TypesArray extends any[],
    Res = never,
    AllProperties = MergeTypes<TypesArray>,
> = TypesArray extends [infer Head, ...infer Rem]
    ? OneOf<Rem, Res | OnlyFirst<Head, AllProperties>, AllProperties>
    : Res;
type OnlyFirst<F, S> = F & { [Key in keyof Omit<S, keyof F>]?: never };

export type IconProps = Parameters<IconType>[0];

export type UserAccountType = Omit<UserAccountsReturnType[number], 'provider'> & {
    provider: UserAccountProvider | string;
};
export type AccountSocialProviders = SocialProvider;
export type UserAccountProvider = AccountSocialProviders | 'credential';
