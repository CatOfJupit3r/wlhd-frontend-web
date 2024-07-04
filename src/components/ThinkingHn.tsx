import { Spinner } from 'react-bootstrap'


const ThinkingHn = (props: { text: string }) => {
    return (
        <div className={'flex flex-row items-center justify-center gap-4'}>
            <h1>{props.text}</h1>
            <Spinner animation="grow" role="status" />
        </div>
    )
}

export default ThinkingHn
