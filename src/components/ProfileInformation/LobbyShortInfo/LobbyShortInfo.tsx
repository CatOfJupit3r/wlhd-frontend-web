import { useCallback, useEffect, useState } from 'react'
import { Placeholder } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { RiVipCrownLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { ShortLobbyInformation } from '@models/APIData'
import APIService from '@services/APIService'
import styles from './LobbyShortInfo.module.css'

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
    const [placeholderParams, ] = useState({
        title: '?'.repeat(Math.round(Math.random() * (10 - 4) + 4)),
        description: '?'.repeat(Math.round(Math.random() * (10 - 4) + 4)),
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

    const Icon = useCallback(() => {
        return (
            <div className={styles.gmIcon}>
                <RiVipCrownLine />
            </div>
        )
    }, [])

    const LoadingPlaceHolder = useCallback(() => {
        return (
            <>
                <Placeholder
                    animation="wave"
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                    }}
                >
                    <Placeholder xs={1} />
                    <Placeholder xs={placeholderParams.title.length} />
                </Placeholder>
                <Placeholder as="p" animation="wave">
                    <Placeholder xs={placeholderParams.description.length} />
                </Placeholder>
            </>
        )
    }, [name])

    const FailedPlaceHolder = useCallback(() => {
        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                    }}
                >
                    <Placeholder xs={1} className={'bg-dark'} />
                    <Placeholder xs={placeholderParams.title.length} className={'bg-dark'} />
                </div>
                <Placeholder xs={placeholderParams.description.length} className={'bg-secondary'} />
            </div>
        )
    }, [name])

    const LobbyInfoContent = useCallback(() => {
        return (
            <>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                    {isGm ? <Icon /> : null}
                    <LinkToLobby />
                </div>
                <p
                    style={{
                        fontSize: 'var(--text-size-small)',
                        margin: '0',
                    }}
                >
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
                return <LoadingPlaceHolder />
            }
            default: {
                return <FailedPlaceHolder />
            }
        }
    }, [status])

    return (
        <Link className={styles.lobbyInfoContainer} to={`../lobby-room/${_id}`}>
            <DecideWhatToShow />
        </Link>
    )
}

export default LobbyShortInfo
