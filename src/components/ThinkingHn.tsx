import { TrueSpinner } from '@components/Spinner'

const ThinkingHn = (props: { text: string }) => {
    return (
        <div className={'flex flex-row items-center justify-center gap-4'}>
            <h1>{props.text}</h1>
            <TrueSpinner size={3} />
        </div>
    )
}

export default ThinkingHn
