import styles from './SpellDisplay.module.css'
import { SpellInfo } from '../../../models/Battlefield'
import { useTranslation } from 'react-i18next'

const SpellDisplay = ({spell}: {spell: SpellInfo}) => {
    const { t } = useTranslation()

    const { decorations, cost, uses, cooldown} = spell

    return (
        <div className={styles.crutch}>
            Hello from SpellDisplay!
        </div>
    )
}

export default SpellDisplay