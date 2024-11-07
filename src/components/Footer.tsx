import { cn } from '@utils'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Footer = () => {
    const { t } = useTranslation('local', {
        keyPrefix: 'footer',
    })
    return (
        <footer className={'relative bottom-0 box-border block min-h-fit w-full justify-center bg-[#252525FF] p-8'}>
            <h1 className={'text-center text-t-normal font-bold text-[#d5d5d5]'}>{t('slogan')}</h1>
            <div
                id={'footer-links'}
                className={cn(
                    'mt-[1%] flex justify-center gap-[1%] text-t-small max-[512px]:flex-col',
                    'max-[512px]:flex-col max-[512px]:items-center max-[512px]:justify-center max-[512px]:gap-2'
                )}
            >
                <Link to={'/'}>{t('home')}</Link>
                <Link to={'/about'}>{t('about')}</Link>
                <Link to={'/contact'}>{t('contact')}</Link>
                <Link to={'/privacy'}>{t('privacy')}</Link>
            </div>
        </footer>
    )
}

export default Footer
