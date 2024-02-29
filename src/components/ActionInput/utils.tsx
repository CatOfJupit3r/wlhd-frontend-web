import {Action} from "../../types/ActionInput";
import Card from "react-bootstrap/Card";
import {Button} from "react-bootstrap";
import {cmdToTranslation} from "../../utils/cmdConverters";
import ActionCard from "./ActionCard";

export const extractCards = (
    action: Action[],
    handleSelect: (e: any) => any,
    t: (key: string) => string,
): JSX.Element => {
    const cards: Array<JSX.Element> = []

    for (let [index, option] of action.entries()) {
        cards.push(
            <ActionCard
                option={option}
                index={index}
                handleSelect={handleSelect}
                t={t}
                key={index}
            />
        )
    }

    return <div className="row m-0 p-0">{cards.sort((a: JSX.Element, b: JSX.Element) => {
        console.log(a.props)
        const {
            aDescriptor,
            bDescriptor,
            aAvailable,
            bAvailable
        } = {
            aDescriptor: a.props.option.translation_info.descriptor,
            bDescriptor: b.props.option.translation_info.descriptor,
            aAvailable: a.props.option.available,
            bAvailable: b.props.option.available
        }
        if (aAvailable && !bAvailable) {
            return -1
        } else if (!aAvailable && bAvailable) {
            return 1
        } else if (aDescriptor < bDescriptor) {
            return -1
        } else if (aDescriptor > bDescriptor) {
            return 1
        }
        return 0
    })}</div>
}