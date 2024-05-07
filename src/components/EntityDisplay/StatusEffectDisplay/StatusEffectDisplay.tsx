import styles from './StatusEffectDisplay.module.css'
import { StatusEffectInfo } from '../../../models/Battlefield'

const StatusEffectDisplay = ({ status_effect }: { status_effect: StatusEffectInfo }) => {
    return <div className={styles.crutch}>Hello from StatusEffectDisplay!</div>
}

export default StatusEffectDisplay
