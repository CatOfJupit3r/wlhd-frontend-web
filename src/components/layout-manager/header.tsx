import { IS_DEVELOPMENT } from '@configuration';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import { BiLogOut, BiSolidCog } from 'react-icons/bi';
import { FaBook } from 'react-icons/fa';
import { LuUser } from 'react-icons/lu';

import { CurrentUserAvatar } from '@components/UserAvatars';
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
import useMe from '@queries/useMe';
import useThisLobby from '@queries/useThisLobby';
import AuthService from '@services/auth-service';
import { apprf, cn } from '@utils';

interface iSection {
    name: string;
    action: () => void;
    icon: IconType;
    className?: string;
    disabled?: boolean;
}

type SectionsType = Array<Array<iSection>>;

const Header = () => {
    const { user, isLoggedIn, refetch } = useMe();
    const { lobbyId } = useThisLobby();
    const navigate = useNavigate();
    const { t } = useTranslation('local', {
        keyPrefix: 'header',
    });

    const sections: SectionsType = useMemo(() => {
        return [
            [
                {
                    name: 'profile',
                    action: () =>
                        navigate({
                            to: '/profile',
                        }),
                    icon: LuUser,
                },
            ],
            [
                {
                    name: 'game-wiki',
                    action: () =>
                        navigate({
                            to: '/game-wiki',
                            resetScroll: true,
                        }),
                    icon: FaBook,
                },
            ],
            [
                IS_DEVELOPMENT
                    ? {
                          name: 'game-test',
                          action: () =>
                              navigate({
                                  to: '/game-test',
                              }),
                          icon: BiSolidCog,
                      }
                    : null,
                {
                    name: 'logout',
                    action: () => {
                        console.log('' + 'Logging out');
                        AuthService.getInstance()
                            .signOut({
                                fetchOptions: { throw: true },
                            })
                            .finally(() => {
                                refetch().then();
                            });
                    },
                    icon: BiLogOut,
                    className: 'text-red-500 hover:text-red-700',
                },
            ].filter((item) => item),
        ] as SectionsType;
    }, [navigate, refetch]);

    const AuthLinks = useCallback(() => {
        return (
            <>
                <Button
                    onClick={() =>
                        navigate({
                            to: '/login',
                        })
                    }
                    variant={'ghost'}
                    size={'sm'}
                >
                    {t('sign-in')}
                </Button>
                <Button
                    onClick={() =>
                        navigate({
                            to: '/sign-up',
                        })
                    }
                    variant={'default'}
                    size={'sm'}
                    className={'bg-accent text-accent-foreground hover:bg-accent/90'}
                >
                    {t('sign-up')}
                </Button>
            </>
        );
    }, [navigate]);

    const LoggedInLinks = useCallback(() => {
        return (
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <div>
                        <CurrentUserAvatar className={'unselectable cursor-pointer text-black'} />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
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
        );
    }, [lobbyId, user?.name]);

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
            <StyledLink to="/" className={'font-bold text-white no-underline'}>
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
