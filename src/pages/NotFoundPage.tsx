import { Link } from 'react-router-dom'
import { GrDocumentMissing } from 'react-icons/gr'
import { apprf, cn } from '@utils'

const NotFoundPage = () => {
    return (
        <div className={'mt-[2vh] flex size-full flex-col items-center'}>
            <div
                className={cn(
                    'flex w-full max-w-[50%] flex-col items-center gap-2',
                    apprf('max-[712px]', 'max-w-full px-10')
                )}
            >
                <h1>Page Not Found</h1>
                <p className={'opacity-60 hover:opacity-100'}>
                    The page you are looking for does not exist. <Link to={'/'}>Go to Home Page</Link>
                </p>
                <GrDocumentMissing className={'mt-5 text-t-bigger text-gray-400'} />
            </div>
        </div>
    )
}

export default NotFoundPage
