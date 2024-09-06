import Overlay from '@components/Overlay'
import { Button } from '@components/ui/button'
import SocketService from '@services/SocketService'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from './LeaveGameOverlay.module.css'

const LeaveGameOverlay = ({ setChosen }: { setChosen: (value: string | null) => void }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.exit',
    })
    const navigate = useNavigate()

    const leaveGame = useCallback(() => {
        SocketService.disconnect()
        setChosen(null)
        navigate('..')
    }, [])

    const stayInGame = useCallback(() => {
        setChosen(null)
    }, [])

    return (
        <Overlay>
            <div className={'flex flex-col items-center justify-center gap-4'}>
                <h1>{t('header')}</h1>
                <h3 className={'font-normal'}>{t('subheader')}</h3>
                <div className={styles.buttons}>
                    <Button onClick={leaveGame} variant={'destructive'} className={'font-normal text-white'}>
                        {t('yes')}
                    </Button>
                    <Button onClick={stayInGame} variant={'ghost'} className={'font-normal'}>
                        {t('no')}
                    </Button>
                </div>
            </div>
        </Overlay>
    )
}

export default LeaveGameOverlay
