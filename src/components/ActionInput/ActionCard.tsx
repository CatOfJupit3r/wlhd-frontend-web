import Card from 'react-bootstrap/Card'
import { BsInfoCircle } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { Action } from '../../models/ActionInput'
import {
    addHighlightedComponent,
    selectCurrentAlias,
    selectHighlightedComponents,
    setChoice,
    setChosenAction,
} from '../../redux/slices/turnSlice'
import styles from './ActionCard.module.css'

const ActionCard = (props: { option: Action; index: number; t: (key: string) => string }) => {
    const dispatch = useDispatch()

    const { option, index, t } = props

    const { descriptor, co_descriptor } = option.translation_info
    const translatedText = t(`${descriptor}.desc`)
    const textNeedsTruncating = translatedText.length > 250
    const displayedText = textNeedsTruncating ? translatedText.substring(0, 250) + '...' : translatedText
    const highlightedComponents = useSelector(selectHighlightedComponents)
    const currentAlias = useSelector(selectCurrentAlias)
    const isHighlighted = highlightedComponents[option.id] > 0

    const handleDoubleClick = () => {
        if (!option.available) {
            return
        }
        dispatch(setChoice({ key: currentAlias, value: option.id }))
        dispatch(addHighlightedComponent(option.id))
        dispatch(
            setChosenAction({
                chosenActionValue: option.id,
                translatedActionValue: t(`${descriptor}.name`),
            })
        )
    }

    return (
        <Card
            border={option.available ? 'primary' : 'secondary'}
            bg={isHighlighted ? 'primary' : undefined}
            key={index}
            onDoubleClick={handleDoubleClick}
            className={option.available ? styles.actionCardAvailable : styles.actionCardUnavailable}
            style={{
                width: '100%',
                minWidth: '100%',
                height: '6rem',
                marginTop: '0.5rem',
            }}
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styles.cardTitle}>
                    {t(`${descriptor}.name`)} {co_descriptor ? `(${co_descriptor})` : ''}
                </Card.Title>
                <Card.Text
                    style={{
                        fontSize: '0.9em',
                    }}
                    className={styles.cardText}
                >
                    {displayedText}{' '}
                    {textNeedsTruncating && <BsInfoCircle onClick={() => alert(`${descriptor}.description`)} />}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default ActionCard
