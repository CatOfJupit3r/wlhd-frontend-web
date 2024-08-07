import Overlay from '@components/Overlay'
import { setChosenMenu } from '@redux/slices/infoSlice'
import { AppDispatch } from '@redux/store'
import SocketService from '@services/SocketService'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './LeaveGameOverlay.module.css'
import { Button } from '@components/ui/button'

const LeaveGameOverlay = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const tPath = useMemo(() => 'local:game.exit.', [])

    const leaveGame = useCallback(() => {
        SocketService.disconnect()
        dispatch(setChosenMenu(null))
        navigate('..')
    }, [])

    const stayInGame = useCallback(() => {
        dispatch(setChosenMenu(null))
    }, [])

    return (
        <Overlay>
            <h1>{t(tPath + 'header')}</h1>
            <h3 className={'font-normal'}>{t(tPath + 'subheader')}</h3>
            <div className={styles.buttons}>
                <Button onClick={leaveGame} variant={'destructive'} className={'font-normal text-white'}>
                    {t(tPath + 'yes')}
                </Button>
                <Button onClick={stayInGame} variant={'ghost'} className={'font-normal'}>
                    {t(tPath + 'no')}
                </Button>
            </div>
        </Overlay>
    )
}

export default LeaveGameOverlay
