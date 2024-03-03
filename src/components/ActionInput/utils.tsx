import {Action} from "../../types/ActionInput";
import ActionCard from "./ActionCard";
import {splitDescriptor} from "../Battlefield/utils";

export const extractCards = (
    action: Action[],
    handleSelect: (e: any) => any,
    handleConfirm: () => any,
    t: (key: string) => string,
    chosenAction: number | undefined
): JSX.Element => {
    const cards: Array<JSX.Element> = []


    for (let [index, option] of action.entries()) {
        cards.push(
            <ActionCard
                option={option}
                index={index}
                handleSelect={handleSelect}
                handleConfirm={handleConfirm}
                chosenAction={chosenAction}
                t={t}
                key={index}
            />
        )
    }

    return <div className="row m-0 p-0">{cards.sort((a: JSX.Element, b: JSX.Element) => {
        const {
            aFullDescriptor,
            bFullDescriptor,
            aAvailable,
            bAvailable
        } = {
            aFullDescriptor: a.props.option.translation_info.descriptor,
            bFullDescriptor: b.props.option.translation_info.descriptor,
            aAvailable: a.props.option.available,
            bAvailable: b.props.option.available
        }
        const aDescriptor = splitDescriptor(aFullDescriptor)[1]
        const bDescriptor = splitDescriptor(bFullDescriptor)[1]
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