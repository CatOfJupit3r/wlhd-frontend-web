import Overlay from '@components/Overlay'
import { setChosenMenu } from '@redux/slices/infoSlice'
import { AppDispatch } from '@redux/store'
import SocketService from '@services/SocketService'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './LeaveGameOverlay.module.css'

const LeaveGameOverlay = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const tPath = useMemo(() => 'local:game.exit.', [])

    const leaveGame = useCallback(() => {
        SocketService.disconnect()
        navigate('..')
    }, [])

    const stayInGame = useCallback(() => {
        dispatch(setChosenMenu(null))
    }, [])

    return (
        <Overlay>
            <h1>{t(tPath + 'header')}</h1>
            <h3>{t(tPath + 'subheader')}</h3>
            <div className={styles.buttons}>
                <button onClick={leaveGame} className={styles.yesButton}>
                    {t(tPath + 'yes')}
                </button>
                <button onClick={stayInGame} className={styles.noButton}>
                    {t(tPath + 'no')}
                </button>
            </div>
        </Overlay>
    )
}

export default LeaveGameOverlay
