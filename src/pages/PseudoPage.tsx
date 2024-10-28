import { Spinner } from '@components/Spinner'

const PseudoPage = () => {
    return (
        <div className={'flex h-screen w-full flex-col items-center justify-center'}>
            <Spinner type={'spin'} />
        </div>
    )
}

export default PseudoPage
