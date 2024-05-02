import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { resetTurnSlice } from '../../redux/slices/turnSlice'
import styles from './HomePage.module.css'
import { AppDispatch } from '../../redux/store'

const HomePage = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(resetTurnSlice())
    }, [dispatch])

    return (
        <>
            <div className={styles.title} id={'title'}>
                <h1>{t('local:index.title')}</h1>
                <h2>{t('local:index.subtitle')}</h2>
            </div>
            <h1>Welcome!</h1>
        </>
    )
}

export default HomePage
