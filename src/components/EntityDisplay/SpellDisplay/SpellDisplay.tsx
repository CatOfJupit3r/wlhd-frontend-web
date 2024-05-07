import styles from './SpellDisplay.module.css'
import { SpellInfo } from '../../../models/Battlefield'

const SpellDisplay = ({spell}: {spell: SpellInfo}) => {
    return (
        <div className={styles.crutch}>
            Hello from SpellDisplay!
        </div>
    )
}

export default SpellDisplay