import Card from 'react-bootstrap/Card'
import { useTranslation } from 'react-i18next'
import { BsInfoCircle } from 'react-icons/bs'
import { Action } from '@models/ActionInput'
import styles from './OptionCard.module.css'

const OptionCard = ({
    option,
    index,
    highlighted,
    callback,
}: {
    option: Action
    index: number
    highlighted?: boolean
    callback?: () => void
}) => {
    const { t } = useTranslation()

    const { descriptor, co_descriptor } = option.translation_info
    const translatedText = t(`${descriptor}.desc`)
    const textNeedsTruncating = translatedText.length > 250
    const displayedText = textNeedsTruncating ? translatedText.substring(0, 250) + '...' : translatedText

    const handleDoubleClick = () => {
        if (!option.available) {
            return
        }
        if (callback) {
            callback()
        }
    }

    return (
        <Card
            border={option.available ? 'primary' : 'secondary'}
            bg={highlighted ? 'primary' : undefined}
            key={index}
            onDoubleClick={handleDoubleClick}
            className={`${styles.actionCard} ${option.available ? styles.actionCardAvailable : styles.actionCardUnavailable} unselectable`}
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styles.cardTitle}>
                    {t(`${descriptor}.name`)} {co_descriptor ? `(${co_descriptor})` : ''}
                </Card.Title>
                <Card.Text style={{ fontSize: '0.9em' }} className={styles.cardText}>
                    {displayedText}{' '}
                    {textNeedsTruncating && <BsInfoCircle onClick={() => alert(`${descriptor}.description`)} />}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default OptionCard
