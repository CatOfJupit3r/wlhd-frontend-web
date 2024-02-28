import {Action} from "../../types/ActionInput";
import Card from "react-bootstrap/Card";
import {Button} from "react-bootstrap";


export const extractCards = (
    action: Action[],
    handleSelect: (e: any) => any
): JSX.Element => {
    const cards: Array<JSX.Element> = []

    for (let [index, option] of action.entries()) {
        const {descriptor, co_descriptor} = option.translation_info
        const textNeedsTruncating = `${descriptor}:description`.length > 100;
        const displayedText = textNeedsTruncating ? `${descriptor}:description`.substring(0, 100) + "..."  : `${descriptor}:description`
        cards.push(
            <Card className={`col-6 col-lg-4 col-md-6 col-sm-12 p-0 flex-grow-1`} key={index}>
                <Card.Body>
                    <Card.Title>{`${descriptor}:name`} {co_descriptor}</Card.Title>
                    <Card.Text>
                        {displayedText}

                        {textNeedsTruncating && <button onClick={() => alert(`${descriptor}:description`)}>Read more</button>}
                    </Card.Text>
                    <Button variant={option.available ? "outline-primary": "outline-secondary" } value={index} onClick={handleSelect}>Select</Button>
                </Card.Body>
            </Card>
        )
    }
    return <div className="row m-0 p-0">{cards}</div>
}