import styles from './ItemDisplay.module.css'
import { ItemInfo } from '../../../models/Battlefield'

const ItemDisplay = ({ item }: { item: ItemInfo}) => {
    return (
        <div className={styles.crutch}>
            Hello from ItemDisplay!
        </div>
    )
}

export default ItemDisplay