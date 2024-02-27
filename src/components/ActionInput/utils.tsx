import {Action} from "../../types/ActionInput";
import Card from "react-bootstrap/Card";
import {Button} from "react-bootstrap";


// export const extractCards = (
//     action: Action[],
//     handleSelect: (e: any) => any
// ): JSX.Element => {
//
//     const cards: Array<JSX.Element> = []
//
//     for (let [index, option] of action.entries()) {
//         const {descriptor, co_descriptor} = option.translation_info
//         cards.push(
//             <div className="col-lg-4 col-md-8 col-sm-12 custom-card"> {/* Add this line */}
//                 <Card key={index} className={"custom-card"}>
//                     <Card.Body>
//                         <Card.Title>{`${descriptor}:name`} {co_descriptor}</Card.Title>
//                         <Card.Text>
//                             {`${descriptor}:description`}
//                         </Card.Text>
//                         <Button variant={option.available ? "outline-primary": "outline-secondary" } value={index} onClick={handleSelect}>Select</Button>
//                     </Card.Body>
//                 </Card>
//             </div>
//         )
//     }
//     return <div className="row custom-card">{cards}</div> // Wrap the cards in a row
// }

export const extractCards = (
    action: Action[],
    handleSelect: (e: any) => any
): JSX.Element => {
    /*
    * This function is used to extract the options from the action object
    * This is not limited to the first, but should be able to extract all the options
    */
    const cards: Array<JSX.Element> = []

    for (let [index, option] of action.entries()) {
        const {descriptor, co_descriptor} = option.translation_info
        const textNeedsTruncating = `${descriptor}:description`.length > 100;
        const displayedText = textNeedsTruncating ? `${descriptor}:description`.substring(0, 100) + "..."  : `${descriptor}:description`
        cards.push(
            <div className="col-lg-4 col-md-6 col-sm-12 custom-card">
                <Card key={index} className={"card-deck"}>
                    <Card.Body>
                        <Card.Title>{`${descriptor}:name`} {co_descriptor}</Card.Title>
                        <Card.Text>
                            {displayedText}

                            {textNeedsTruncating && <button onClick={() => alert(`${descriptor}:description`)}>Read more</button>}
                        </Card.Text>
                        <Button variant={option.available ? "outline-primary": "outline-secondary" } value={index} onClick={handleSelect}>Select</Button>
                    </Card.Body>
                </Card>
            </div>
        )
    }
    return <div className="row">{cards}</div>
}