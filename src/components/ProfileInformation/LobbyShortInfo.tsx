import { Card, CardContent } from '@components/ui/card'
import CommaSeparatedList from '@components/ui/coma-separated-list'
import { Skeleton } from '@components/ui/skeleton'
import StyledLink from '@components/ui/styled-link'
import { ShortLobbyInformation } from '@models/APIData'
import paths from '@router/paths'
import APIService from '@services/APIService'
import { Crown } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type LoadingType = 'loading' | 'failed' | 'success'

const LobbyShortInfo = ({ lobbyId }: { lobbyId: string }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'profile',
    })
    const [lobbyInfo, setLobbyInfo] = useState<ShortLobbyInformation>({
        name: '???',
        isGm: false,
        _id: '',
        characters: [],
    })
    const [status, setStatus] = useState<LoadingType>('loading')
    const [placeholderParams] = useState({
        title: Math.floor(Math.random() * 16) + 5,
        description: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
            () => Math.floor(Math.random() * 8) + 8
        ),
    })

    useEffect(() => {
        if (!lobbyId) {
            setStatus('failed')
            return
        }
        const fetchLobbyInfo = async () => {
            try {
                const response = await APIService.getShortLobbyInfo(lobbyId)
                setLobbyInfo(response)
                setStatus('success')
            } catch (_) {
                setStatus('failed')
            }
        }
        fetchLobbyInfo().then()
    }, [lobbyId])

    const LinkToLobby = useCallback(
        () => <p className="text-xl font-semibold">{lobbyInfo.name || '???'}</p>,
        [lobbyInfo.name]
    )

    const Placeholders = useCallback(
        ({ pulsating = true }: { pulsating?: boolean }) => (
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton
                        className={`h-6 ${pulsating ? 'animate-pulse' : ''}`}
                        style={{ width: `${placeholderParams.title}rem` }}
                    />
                </div>
                {placeholderParams.description.map((width, index) => (
                    <Skeleton
                        key={index}
                        className={`h-4 ${pulsating ? 'animate-pulse' : ''}`}
                        style={{ width: `${width}rem` }}
                    />
                ))}
            </div>
        ),
        [placeholderParams]
    )

    const LobbyInfoContent = useCallback(
        () => (
            <div className="space-y-1">
                <div className="flex items-center space-x-2">
                    {lobbyInfo.isGm && <Crown className="size-5 text-yellow-500" />}
                    <LinkToLobby />
                </div>
                <CommaSeparatedList
                    className="text-base text-muted-foreground"
                    items={lobbyInfo.characters}
                    renderItem={(char) => char}
                    emptyMessage={t('no-character-assigned')}
                />
            </div>
        ),
        [lobbyInfo, t]
    )

    const DecideWhatToShow = useCallback(() => {
        switch (status) {
            case 'success':
                return <LobbyInfoContent />
            case 'loading':
                return <Placeholders pulsating={true} />
            default:
                return <Placeholders pulsating={false} />
        }
    }, [status, LobbyInfoContent, Placeholders])

    return (
        <StyledLink to={paths.lobbyRoom.replace(':lobbyId', lobbyId)} className="block w-full no-underline">
            <Card className="transition-colors duration-200 hover:bg-accent">
                <CardContent className="p-4">
                    <DecideWhatToShow />
                </CardContent>
            </Card>
        </StyledLink>
    )
}

export default LobbyShortInfo
