import styles from './StatusEffectDisplay.module.css'
import { StatusEffectInfo } from '../../../models/Battlefield'
import { useTranslation } from 'react-i18next'

const StatusEffectDisplay = ({ status_effect }: { status_effect: StatusEffectInfo }) => {
    const { t } = useTranslation()

    const { decorations, duration } = status_effect

    return <div className={styles.crutch}>Hello from StatusEffectDisplay!</div>
}

export default StatusEffectDisplay
