import { resetTurnSlice } from '@redux/slices/turnSlice'
import { AppDispatch } from '@redux/store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

const HomePage = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(resetTurnSlice())
    }, [dispatch])

    return (
        <>
            <div className={'mb-5 mt-2 flex-col text-center align-middle'} id={'home-title'}>
                <h1>{t('local:index.title')}</h1>
                <h2 className={'font-normal'}>{t('local:index.subtitle')}</h2>
            </div>
        </>
    )
}

export default HomePage
