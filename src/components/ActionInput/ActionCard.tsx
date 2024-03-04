import React from 'react';
import Card from "react-bootstrap/Card";
import {cmdToTranslation} from "../../utils/cmdConverters";
import {Action} from "../../models/ActionInput";
import {BsInfoCircle} from "react-icons/bs";
import styles from "./ActionCard.module.css"


const ActionCard = (props: {
    option: Action,
    index: number,
    handleSelect: (e: any) => any,
    handleConfirm: () => any,
    chosenAction: number | undefined,
    t: (key: string) => string
}) => {

    const {option, index, handleSelect, t} = props

    const {descriptor, co_descriptor} = option.translation_info
    const convertedDescriptor = cmdToTranslation(`${descriptor}:desc`)
    const translatedText = t(convertedDescriptor)
    const textNeedsTruncating = translatedText.length > 250;
    const displayedText = textNeedsTruncating ? translatedText.substring(0, 250) + "..."  : translatedText

    return (
        <Card
            className={`col-6 col-lg-4 col-md-6 col-sm-12 flex-grow-1 ${styles.actionCard}`}
            border={
                option.available ? "primary" : "secondary"
            }
            bg={props.chosenAction === index ? "primary" : undefined}
            key={index}
            onClick={() => {handleSelect(index)}}
            onDoubleClick={() => {props.handleConfirm()}}
            style={{
                color: props.chosenAction !== index ? "black" : "white",
            }}
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styles.cardTitle}>{t(cmdToTranslation(`${descriptor}:name`))} {co_descriptor ? `(${co_descriptor})`: ""}</Card.Title>
                <Card.Text style={{
                    fontSize: "0.9em"
                }} className={styles.cardText}>
                    {displayedText}
                    {" "}
                    {textNeedsTruncating && <BsInfoCircle onClick={() => alert(`${descriptor}:description`)}/>}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ActionCard;