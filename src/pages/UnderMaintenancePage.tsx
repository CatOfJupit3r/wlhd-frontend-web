import { Button } from '@components/ui/button';
import StyledLink from '@components/ui/styled-link';
import { useTranslation } from 'react-i18next';
import { FaArrowRotateRight } from 'react-icons/fa6';

const UnderMaintenancePage = () => {
    const { t } = useTranslation();
    return (
        <div className={'m-0 mt-[10vh] flex h-screen w-full flex-col items-center'}>
            <div className={'flex max-w-[30rem] flex-col gap-4'}>
                <h3 className={'break-words'}>{t('local:under_maintenance.title')}</h3>
                <Button
                    type={'button'}
                    className={'h-12 w-full justify-normal p-6 text-left align-baseline'}
                    onClick={() => {
                        window.location.reload();
                    }}
                >
                    <FaArrowRotateRight className={'mr-4'} />
                    <p className={'font-bold'}>{t('local:under_maintenance.reload')}</p>
                </Button>
                <p className="max-w-[30rem] opacity-60">
                    {t('local:under_maintenance.explanation')}{' '}
                    <StyledLink
                        to={'https://github.com/CatOfJupit3r'}
                        className={'font-extrabold text-blue-800'}
                        target={'_blank'}
                    >
                        {t('local:under_maintenance.link')}
                    </StyledLink>
                    . {t('local:under_maintenance.thanks')}
                </p>
            </div>
        </div>
    );
};

export default UnderMaintenancePage;
