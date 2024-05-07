import { WeaponInfo } from '../../../models/Battlefield'
import styles from './WeaponDisplay.module.css'

const WeaponDisplay = ({ weapon }: { weapon: WeaponInfo }) => {
    return <div className={styles.crutch}>Hello from WeaponDisplay!</div>
}

export default WeaponDisplay
