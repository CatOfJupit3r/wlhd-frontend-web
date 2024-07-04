import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { resetTurnSlice } from '@redux/slices/turnSlice'
import { AppDispatch } from '@redux/store'

const HomePage = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(resetTurnSlice())
    }, [dispatch])

    return (
        <>
            <div className={"flex-col align-items-center text-center mb-5 mt-2"} id={'home-title'}>
                <h1>{t('local:index.title')}</h1>
                <h2>{t('local:index.subtitle')}</h2>
            </div>
        </>
    )
}

export default HomePage
