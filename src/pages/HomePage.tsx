import { useTranslation } from 'react-i18next'

const HomePage = () => {
    const { t } = useTranslation('local', {
        keyPrefix: 'index',
    })

    return (
        <>
            <div className={'mb-5 mt-2 flex-col text-center align-middle'} id={'home-title'}>
                <h1>{t('title')}</h1>
                <h2 className={'font-normal'}>{t('subtitle')}</h2>
            </div>
        </>
    )
}

export default HomePage
