import { Button } from '@components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import StyledLink from '@components/ui/styled-link';
import { CurrentUserAvatar } from '@components/UserAvatars';
import useMe from '@queries/useMe';
import useThisLobby from '@queries/useThisLobby';
import paths from '@router/paths';
import AuthManager from '@services/AuthManager';
import { apprf, cn } from '@utils';
import { IS_DEVELOPMENT } from 'config';
import { startTransition, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import { BiLogOut, BiSolidCog } from 'react-icons/bi';
import { FaBook } from 'react-icons/fa';
import { LuSquareMenu, LuUser } from 'react-icons/lu';
import { useNavigate } from 'react-router';

interface iSection {
    name: string;
    action: () => void;
    icon: IconType;
    className?: string;
    disabled?: boolean;
}

type SectionsType = Array<Array<iSection>>;

const Header = () => {
    const { user, isLoggedIn } = useMe();
    const { lobbyId } = useThisLobby();
    const navigate = useNavigate();
    const { t } = useTranslation('local', {
        keyPrefix: 'header',
    });

    const redirect = useCallback((to: string, relative: 'path' | 'route' = 'path') => {
        return () => {
            startTransition(() => {
                navigate(to, {
                    relative,
                });
            });
        };
    }, []);

    const sections: SectionsType = useMemo(() => {
        return [
            [
                {
                    name: 'profile',
                    action: redirect(paths.profile, 'path'),
                    icon: LuUser,
                },
                {
                    name: 'recent-lobby',
                    action: lobbyId ? redirect(paths.lobbyRoom.replace(':lobbyId', lobbyId), 'path') : () => {},
                    icon: LuSquareMenu,
                    disabled: !lobbyId,
                },
            ],
            [
                {
                    name: 'game-wiki',
                    action: redirect(paths.wiki, 'path'),
                    icon: FaBook,
                },
            ],
            [
                IS_DEVELOPMENT
                    ? {
                          name: 'game-test',
                          action: redirect(paths.gameTest, 'path'),
                          icon: BiSolidCog,
                      }
                    : null,
                {
                    name: 'logout',
                    action: () => AuthManager.logout(),
                    icon: BiLogOut,
                    className: 'text-red-500 hover:text-red-700',
                },
            ].filter((item) => item),
        ] as SectionsType;
    }, [redirect]);

    const AuthLinks = useCallback(() => {
        return (
            <>
                <Button onClick={redirect(paths.signIn, 'path')} variant={'ghost'} size={'sm'}>
                    {t('sign-in')}
                </Button>
                <Button
                    onClick={redirect(paths.signUp, 'path')}
                    variant={'default'}
                    size={'sm'}
                    className={'bg-accent text-accent-foreground hover:bg-accent/90'}
                >
                    {t('sign-up')}
                </Button>
            </>
        );
    }, []);

    const LoggedInLinks = useCallback(() => {
        return (
            <>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <CurrentUserAvatar className={'unselectable cursor-pointer text-black'} />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>@{user?.handle}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {sections.map((section, index) => (
                            <div key={index}>
                                <DropdownMenuGroup>
                                    {section.map(({ name, action, icon: Icon, className, disabled }, index) => (
                                        <DropdownMenuItem key={`item_${index}`} onClick={action} disabled={disabled}>
                                            <Icon className="mr-2 size-5" />
                                            <span className={className}>{t(name)}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        );
    }, [lobbyId, user?.handle]);

    const Navigation = useCallback(() => {
        return (
            <nav
                id={'header-nav'}
                className={cn(
                    'flex justify-between gap-3 text-white',
                    apprf('max-[512px]', 'flex-col overflow-x-auto align-middle'),
                )}
            >
                {isLoggedIn ? <LoggedInLinks /> : <AuthLinks />}
            </nav>
        );
    }, [LoggedInLinks, AuthLinks, isLoggedIn]);

    return (
        <header
            className={cn(
                'relative top-0 flex w-full justify-between bg-black p-4 text-xl text-white',
                apprf('max-[512px]', 'flex-col justify-center gap-3 bg-black p-4 text-center align-middle'),
            )}
        >
            <StyledLink to="." relative={'route'} id={'header-logo'} className={'font-bold text-white no-underline'}>
                Walenholde
            </StyledLink>
            {/* you served well, o' feline. For this, you will be engraved here until the end of times. */}
            {/*<img src={"assets/local/cat_eat.gif"} alt="cat" style={{*/}
            {/*    height: "400px",*/}
            {/*    width: "100%"*/}
            {/*}}/>*/}
            <Navigation />
        </header>
    );
};

export default Header;
