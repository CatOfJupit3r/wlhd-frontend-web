import { Button } from '@components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import UserAvatar from '@components/UserAvatar'
import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { selectUserInformation } from '@redux/slices/cosmeticsSlice'
import { selectLobbyId } from '@redux/slices/lobbySlice'
import paths from '@router/paths'
import AuthManager from '@services/AuthManager'
import { apprf, cn } from '@utils'
import { useCallback, useMemo } from 'react'
import { IconType } from 'react-icons'
import { BiLogOut, BiSolidCog } from 'react-icons/bi'
import { FaBook, FaBookOpen } from 'react-icons/fa'
import { IoLogoBuffer } from 'react-icons/io'
import { LuMenuSquare, LuUser } from 'react-icons/lu'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
    const { isLoggedIn } = useIsLoggedIn()
    const { avatar, handle } = useSelector(selectUserInformation)
    const lobbyId = useSelector(selectLobbyId)
    const navigate = useNavigate()

    const redirect = useCallback((to: string, relative: 'path' | 'route' = 'path') => {
        return () => {
            navigate(to, {
                relative,
            })
        }
    }, [])

    const AuthLinks = useCallback(() => {
        return (
            <>
                <Button onClick={redirect(paths.signIn, 'path')} variant={'ghost'} size={'sm'}>
                    Sign In
                </Button>
                <Button
                    onClick={redirect(paths.signUp, 'path')}
                    variant={'default'}
                    size={'sm'}
                    className={'bg-accent text-accent-foreground hover:bg-accent/90'}
                >
                    Register
                </Button>
            </>
        )
    }, [])

    const LoggedInLinks = useCallback(() => {
        const sections: Array<
            Array<{
                name: string
                action: () => void
                icon: IconType
                className?: string | undefined
                disabled?: boolean | undefined
            }>
        > = useMemo(() => {
            return [
                [
                    {
                        name: 'Profile',
                        action: redirect(paths.profile, 'path'),
                        icon: LuUser,
                    },
                    {
                        name: 'Recent Lobby',
                        action: lobbyId ? redirect(paths.lobbyRoom.replace(':lobbyId', lobbyId), 'path') : () => {},
                        icon: LuMenuSquare,
                        disabled: !lobbyId,
                    },
                ],
                [
                    {
                        name: 'Rulebook',
                        action: redirect('rulebook', 'path'),
                        icon: FaBook,
                    },
                    {
                        name: 'World Description',
                        action: redirect('world-description', 'path'),
                        icon: FaBookOpen,
                    },
                    {
                        name: 'How to',
                        action: redirect('how-to', 'path'),
                        icon: IoLogoBuffer,
                    },
                ],
                [
                    {
                        name: 'Game Test',
                        action: redirect(paths.gameTest, 'path'),
                        icon: BiSolidCog,
                    },
                    {
                        name: 'Logout',
                        action: () => AuthManager.logout(),
                        icon: BiLogOut,
                        className: 'text-red-500 hover:text-red-700',
                    },
                ],
            ]
        }, [redirect])

        return (
            <>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <UserAvatar className={'unselectable cursor-pointer text-black'} />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>@{handle}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {sections.map((section, index) => (
                            <div key={index}>
                                <DropdownMenuGroup>
                                    {section.map(({ name, action, icon: Icon, className, disabled }, index) => (
                                        <DropdownMenuItem key={`item_${index}`} onClick={action} disabled={disabled}>
                                            <Icon className="mr-2 size-5" />
                                            <span className={className}>{name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        )
    }, [lobbyId, avatar, handle])

    const Navigation = useCallback(() => {
        return (
            <nav
                id={'header-nav'}
                className={cn(
                    'flex justify-between gap-3 text-white',
                    apprf('max-[512px]', 'flex-col overflow-x-auto align-middle')
                )}
            >
                {isLoggedIn ? <LoggedInLinks /> : <AuthLinks />}
            </nav>
        )
    }, [LoggedInLinks, AuthLinks, isLoggedIn])

    return (
        <header
            className={cn(
                'relative top-0 flex w-full justify-between bg-black p-4 text-t-normal text-white',
                apprf('max-[512px]', 'flex-col justify-center gap-3 bg-black p-4 text-center align-middle')
            )}
        >
            <Link to="." relative={'route'} id={'header-logo'} className={'font-bold text-white no-underline'}>
                Walenholde
            </Link>
            {/* you served well, o' feline. For this, you will be engraved here until the end of times. */}
            {/*<img src={"assets/local/cat_eat.gif"} alt="cat" style={{*/}
            {/*    height: "400px",*/}
            {/*    width: "100%"*/}
            {/*}}/>*/}
            <Navigation />
        </header>
    )
}

export default Header
