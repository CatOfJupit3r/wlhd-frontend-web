import { Spinner } from 'react-bootstrap'
import styles from './ThinkingHn.module.css'

const ThinkingHn = (props: { text: string }) => {
    return (
        <div className={styles.thinkingHnContainer}>
            <h1
                style={{
                    margin: 0,
                }}
            >
                {props.text}
            </h1>
            <Spinner animation="grow" role="status" />
        </div>
    )
}

export default ThinkingHn
