import { Button } from '@components/ui/button'
import { Link } from 'react-router-dom'
import { FaArrowRotateRight } from 'react-icons/fa6'

const UnderMaintenancePage = () => {
    return (
        <div className={'m-0 mt-[10vh] flex h-screen w-full flex-col items-center'}>
            <div className={'flex max-w-[30rem] flex-col gap-4'}>
                <h3 className={'break-words'}>
                    It seems your browser cannot access our servers. {'\n'}Please try again later.
                </h3>
                <Button
                    type={'button'}
                    className={'h-12 w-full justify-normal p-6 text-left align-baseline'}
                    onClick={() => {
                        window.location.reload()
                    }}
                >
                    <FaArrowRotateRight className={'mr-4'} />
                    <p>Try again :(</p>
                </Button>
                <p className="max-w-[30rem] opacity-60">
                    If you think this should not have happened or this issue persists, please contact me at{' '}
                    <Link to={'https://github.com/CatOfJupit3r'} className={'text-blue-800'} target={'_blank'}>
                        GitHub
                    </Link>
                    . Thanks for your patience and support! This means a lot to me.
                </p>
            </div>
        </div>
    )
}

export default UnderMaintenancePage
