import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { selectLobbyId } from '@redux/slices/lobbySlice'
import paths from '@router/paths'
import AuthManager from '@services/AuthManager'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { selectUserInformation } from '@redux/slices/cosmeticsSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { FaBook, FaBookOpen } from 'react-icons/fa'
import { IoLogoBuffer } from 'react-icons/io'
import { BiLogOut, BiSolidCog } from 'react-icons/bi'
import { Button } from '@components/ui/button'
import { IconType } from 'react-icons'
import { LuMenuSquare, LuUser } from 'react-icons/lu'

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
                        <Avatar className={'unselectable'}>
                            {avatar && <AvatarImage src={avatar} />}
                            <AvatarFallback className="text-black">{'<3'}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>@{handle}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {sections.map((section,index) => (
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
                className={
                    'flex justify-between gap-3 text-white max-[512px]:flex-col max-[512px]:overflow-x-auto max-[512px]:align-middle'
                }
            >
                {isLoggedIn ? <LoggedInLinks /> : <AuthLinks />}
            </nav>
        )
    }, [LoggedInLinks, AuthLinks, isLoggedIn])

    return (
        <header
            className={`relative top-0 flex w-full justify-between bg-black p-4 text-t-normal text-white max-[512px]:flex-col
                max-[512px]:justify-center max-[512px]:gap-3 max-[512px]:bg-black max-[512px]:p-4 max-[512px]:text-center
                max-[512px]:align-middle`}
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
