import ElementWithIcon from '@components/ElementWithIcon'
import { Skeleton } from '@components/ui/skeleton'
import { ShortLobbyInformation } from '@models/APIData'
import APIService from '@services/APIService'
import { rand } from '@utils'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiVipCrownLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

type LoadingType = 'loading' | 'failed' | 'success'

const LobbyShortInfo = ({ lobbyId }: { lobbyId: string }) => {
    const { t } = useTranslation()

    const [{ name, isGm, characters, _id }, setInfo] = useState({
        name: '???',
        isGm: false,
        _id: '',
        characters: [],
    } as ShortLobbyInformation)
    const [status, setStatus] = useState('loading' as LoadingType)
    const [placeholderParams] = useState({
        title: rand.randNumber(20, 5),
        description: Array.from({ length: rand.randNumber(3, 1) }).map(() => rand.randNumber(15, 8)),
    })

    useEffect(() => {
        setStatus('failed')
        if (!lobbyId) {
            return
        }
        APIService.getShortLobbyInfo(lobbyId)
            .then((value) => {
                setInfo(value)
                setStatus('success')
            })
            .catch(() => {
                setStatus('failed')
            })
    }, [])

    const LinkToLobby = useCallback(() => {
        return (
            <p
                style={{
                    fontSize: 'var(--text-size-normal)',
                }}
            >
                {name || '???'}
            </p>
        )
    }, [_id, name])

    const Placeholders = useCallback(
        (props: { static?: boolean }) => {
            return (
                <>
                    <div id={'title-and-icon'} className={'flex gap-1'}>
                        <Skeleton className={'size-10 bg-gray-500'} static={props.static || false} />
                        <Skeleton
                            className={'h-10 bg-gray-500'}
                            style={{
                                width: `${placeholderParams.title}rem`,
                            }}
                            static={props.static || false}
                        />
                    </div>
                    {placeholderParams.description.map((value, index) => {
                        return (
                            <Skeleton
                                key={index}
                                className={'h-3 bg-gray-500'}
                                style={{
                                    width: `${value}rem`,
                                }}
                                static={props.static || false}
                            />
                        )
                    }, [])}
                </>
            )
        },
        [name, _id]
    )

    const LobbyInfoContent = useCallback(() => {
        return (
            <>
                {isGm ? (
                    <ElementWithIcon icon={<RiVipCrownLine />} element={<LinkToLobby />} iconPosition={'together'} />
                ) : (
                    <LinkToLobby />
                )}
                <p className={'text-t-small'}>
                    {characters.length
                        ? `Playing as ${characters.map((value) => t(value)).join(', ')}`
                        : 'No character assigned'}
                </p>
            </>
        )
    }, [name, isGm, characters, _id])

    const DecideWhatToShow = useCallback(() => {
        switch (status) {
            case 'success': {
                return <LobbyInfoContent />
            }
            case 'loading': {
                return <Placeholders static={false} />
            }
            default: {
                return <Placeholders static={true} />
            }
        }
    }, [status])

    return (
        <Link
            className={`border-container-medium flex w-full flex-col gap-2 p-2 text-t-normal text-black no-underline hover:bg-gray-200
                hover:transition-colors hover:duration-100`}
            to={`../lobby-room/${_id}`}
        >
            <DecideWhatToShow />
        </Link>
    )
}

export default LobbyShortInfo
