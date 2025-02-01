import StyledLink from '@components/ui/styled-link';
import { cn } from '@utils';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation('local', {
        keyPrefix: 'footer',
    });
    return (
        <footer className={'relative bottom-0 box-border block min-h-fit w-full justify-center bg-[#252525FF] p-8'}>
            <h1 className={'text-center text-xl font-bold text-[#d5d5d5]'}>{t('slogan')}</h1>
            <div
                id={'footer-links'}
                className={cn(
                    'mt-[1%] flex justify-center gap-[1%] text-base max-[512px]:flex-col',
                    'max-[512px]:flex-col max-[512px]:items-center max-[512px]:justify-center max-[512px]:gap-2',
                )}
            >
                <StyledLink to={'/'}>{t('home')}</StyledLink>
                <StyledLink to={'/about'}>{t('about')}</StyledLink>
                <StyledLink to={'/contact'}>{t('contact')}</StyledLink>
                <StyledLink to={'/privacy'}>{t('privacy')}</StyledLink>
            </div>
        </footer>
    );
};

export default Footer;
