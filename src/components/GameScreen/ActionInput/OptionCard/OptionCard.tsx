import { Action } from '@models/ActionInput'
import { useTranslation } from 'react-i18next'
import { BsInfoCircle } from 'react-icons/bs'
import styles from './OptionCard.module.css'
import { cn } from '@lib/utils'

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
        <div
            className={cn(
                styles.actionCard,
                'border-container-big p-3',
                option.available ? styles.actionCardAvailable : styles.actionCardUnavailable,
                'unselectable',
                highlighted && styles.actionCardHighlighted
            )}
            key={index}
            onDoubleClick={handleDoubleClick}
        >
            <p className={'text-t-normal font-semibold'}>
                {t(`${descriptor}.name`)} {co_descriptor ? `(${co_descriptor})` : ''}
            </p>
            <p className={''}>
                {displayedText}{' '}
                {textNeedsTruncating && <BsInfoCircle onClick={() => alert(`${descriptor}.description`)} />}
            </p>
        </div>
    )
}

export default OptionCard
