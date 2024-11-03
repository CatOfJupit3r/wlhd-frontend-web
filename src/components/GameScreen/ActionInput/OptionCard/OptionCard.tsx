import { useTranslation } from 'react-i18next'
import { BsInfoCircle } from 'react-icons/bs'
import styles from './OptionCard.module.css'

import { useActionContext } from '@context/ActionContext'
import { Action } from '@models/GameModels'
import { cn } from '@utils'
import { useCallback, useMemo } from 'react'

const OptionCard = ({
    option,
    index,
    highlighted,
    alias,
}: {
    option: Action
    index: number
    alias: string
    aliasTranslated: string
    highlighted?: boolean
}) => {
    const { t } = useTranslation()

    const { descriptor, co_descriptor } = useMemo(() => option.translation_info, [option.translation_info])
    const translatedText = useMemo(() => t(`${descriptor}.desc`), [descriptor])
    const textNeedsTruncating = useMemo(() => translatedText.length > 250, [translatedText])
    const displayedText = useMemo(
        () => (textNeedsTruncating ? translatedText.substring(0, 250) + '...' : translatedText),
        [translatedText, textNeedsTruncating]
    )
    const { setChoice } = useActionContext()

    const handleDoubleClick = useCallback(() => {
        if (!option.available) {
            return
        }
        setChoice(alias, option.id, t(`${option.translation_info.descriptor}.name`))
    }, [option, setChoice, descriptor])

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
