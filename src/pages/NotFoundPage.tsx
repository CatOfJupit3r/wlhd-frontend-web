import { apprf, cn } from '@utils'
import { useTranslation } from 'react-i18next'
import { GrDocumentMissing } from 'react-icons/gr'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    const { t } = useTranslation()
    return (
        <div className={'mt-[2vh] flex size-full flex-col items-center'}>
            <div
                className={cn(
                    'flex w-full max-w-[50%] flex-col items-center gap-2',
                    apprf('max-[712px]', 'max-w-full px-10')
                )}
            >
                <h1>{t('local:not_found.title')}</h1>
                <p className={'opacity-60 hover:opacity-100'}>
                    {t('local:not_found.explanation')} <Link to={'/'}>{t('local:not_found.back')}</Link>
                </p>
                <GrDocumentMissing className={'mt-5 text-t-bigger text-gray-400'} />
            </div>
        </div>
    )
}

export default NotFoundPage
