import React from 'react';
import example from "../../data/example_bf.json"
import {battlefieldStyle} from "./styles";
import {parseBattlefield} from "./utils";


const onClickTile = (event: React.MouseEvent<HTMLImageElement>) => {
    console.log(event.currentTarget.id)
}

const Battlefield = () => {

    const {battlefield, columns, lines, connectors, separators} = parseBattlefield(example, onClickTile)

    const numberOfRows = battlefield.length
    const allyRowIndexes = Array.from({length: Math.floor(numberOfRows / 2)}, (_, i) => i)
    const enemyRows = Array.from({length: Math.floor(numberOfRows / 2)}, (_, i) => i + Math.floor(numberOfRows / 2))

    const toRender = () => {
        let rendered: Array<JSX.Element> = []

        const columnHelpRow = (key: number) => {
            rendered.push(<div key={`column-help-${key}`} style={{
                display: "flex",
            }}>
                {connectors("connector-1")}
                {columns}
                {connectors("connector-2")}
            </div>)
        }

        const displayRows = (rows: number[]) => {
            for (let i of rows) {
                rendered.push(<div style={{
                    display: "flex",
                }} key={`entity-row-${i}`}>
                    {lines[i]}
                    {battlefield[i]}
                    {lines[i]}
                </div>)
            }
        }

        const displaySeparators = () => {
            rendered.push(<div style={{
                display: "flex",
            }} key={"separator-row"}>
                {connectors("connector-1")}
                {[...Array(columns.length)].map((_) => separators(`separator-${Math.random()}`))}
                {connectors("connector-2")}
            </div>)
        }

        columnHelpRow(1)
        displayRows(allyRowIndexes)
        displaySeparators()
        displayRows(enemyRows)
        columnHelpRow(2)

        return rendered
    }

    return (
        <div style={battlefieldStyle}>
            {
                toRender()
            }
        </div>
    );
};

export default Battlefield;