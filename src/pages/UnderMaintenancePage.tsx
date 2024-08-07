import { Button } from '@components/ui/button'
import { Link } from 'react-router-dom'
import { FaArrowRotateRight } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

const UnderMaintenancePage = () => {
    const { t } = useTranslation()
    return (
        <div className={'m-0 mt-[10vh] flex h-screen w-full flex-col items-center'}>
            <div className={'flex max-w-[30rem] flex-col gap-4'}>
                <h3 className={'break-words'}>{t('local:under_maintenance.title')}</h3>
                <Button
                    type={'button'}
                    className={'h-12 w-full justify-normal p-6 text-left align-baseline'}
                    onClick={() => {
                        window.location.reload()
                    }}
                >
                    <FaArrowRotateRight className={'mr-4'} />
                    <p className={'font-bold'}>{t('local:under_maintenance.reload')}</p>
                </Button>
                <p className="max-w-[30rem] opacity-60">
                    {t('local:under_maintenance.explanation')}{' '}
                    <Link
                        to={'https://github.com/CatOfJupit3r'}
                        className={'text-blue-800 font-extrabold'}
                        target={'_blank'}
                    >
                        {t('local:under_maintenance.link')}
                    </Link>
                    . {t('local:under_maintenance.thanks')}
                </p>
            </div>
        </div>
    )
}

export default UnderMaintenancePage
