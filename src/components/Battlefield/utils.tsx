import React from "react";
import {Battlefield as BattlefieldInterface, ParsedBattlefield} from "../../types/Battlefield";
import TileCosmetic from "./TileCosmetic";
import TileEntity from "./TileEntity";

export const generateAssetPath = (dlc: string, descriptor: string) => {
    return `assets/${dlc}/${descriptor}.png`;
};

export const splitDescriptor = (full_descriptor: string): [string, string] => {
    if (!full_descriptor.includes("::")) {
        // If the descriptor does not have specified a dlc, we assume it is a builtins asset
        return ["builtins", full_descriptor]
    }
    return full_descriptor.split("::").length === 2 ?
        full_descriptor.split("::") as [string, string]
        :
        ["builtins", "invalid"]
}


export const parseBattlefield = (data: BattlefieldInterface): ParsedBattlefield => {
    const battlefield = data.battlefield
    const game_descriptors = data.game_descriptors

    const columns = (key: string) => game_descriptors.columns.map((descriptor, index) => {
        return <TileCosmetic full_descriptor={descriptor} id={`column_${index}`} key={`column-${index}-${key}`} />
    })
    const lines = (key: string) => game_descriptors.lines.map((descriptor, index) => {
        return <TileCosmetic full_descriptor={descriptor} id={`line_${index}`} key={`line_-${index}-${key}`} />
    })
    const [connectors, separators] = [game_descriptors.connectors, game_descriptors.separators].map((descriptor, index) => {
        return (key: string) => {
            return <TileCosmetic full_descriptor={descriptor} id={index === 0 ? "connector" : "separator"} key={key} />
        }
    })
    const field_components = game_descriptors.field_components
    const battlefieldJSX: JSX.Element[][] = Array<Array<JSX.Element>>()
    for (let i = 0; i < battlefield.length; i++) {
        const row = []
        for (let j = 0; j < battlefield[i].length; j++) {
            const alias = battlefield[i][j]
            const full_descriptor = field_components[alias]
            const tile_id = `${i + 1}/${j + 1}`
            const isAlly = i + 1 > Math.floor(battlefield.length / 2)
            row.push(<TileEntity full_descriptor={full_descriptor} id={tile_id} key={tile_id} fallback={{
                path: isAlly ? "assets/builtins/ally.png" : "assets/builtins/enemy.png",
                alt: isAlly ? "ally" : "enemy"
            }} />)
        }
        battlefieldJSX.push(row)
    }
    return {
        battlefield: battlefieldJSX,
        columns: columns,
        lines: lines,
        connectors: connectors,
        separators: separators
    }
}

export const parsedToJSX = (parsed: ParsedBattlefield) => {
    const timeNow = performance.now()
    const {battlefield, columns, lines, connectors, separators} = parsed

    const numberOfRows = battlefield.length
    const allyRowIndexes = Array.from({length: Math.floor(numberOfRows / 2)}, (_, i) => i)
    const enemyRows = Array.from({length: Math.floor(numberOfRows / 2)}, (_, i) => i + Math.floor(numberOfRows / 2))

    let rendered: Array<JSX.Element> = []

    const columnHelpRow = (key: string) => {
        rendered.push(<div
            key={`column-help-${key}`}
            style={{
                display: "flex",
            }}>
            {connectors(`column-connector-${key}`)}
            {columns(key)}
            {connectors(`column-connector-${key + 1}`)}
        </div>)
    }

    const displayRows = (rows: number[], side_type: string) => {
        const right_lines = lines(`${side_type}_right`)
        const left_lines = lines(`${side_type}_left`)
        for (let i of rows) {
            rendered.push(<div style={{
                display: "flex",
            }} key={`entity-row-${i}`}>
                {right_lines[i]}
                {battlefield[i]}
                {left_lines[i]}
            </div>)
        }
    }

    const displaySeparators = () => {
        rendered.push(<div style={{
            display: "flex",
        }} key={"separator-row"}>
            {connectors('1')}
            {[...Array(columns('0').length)].map((_, index) => separators(`separator-${index}`))}
            {connectors('2')}
        </div>)
    }

    columnHelpRow("1")
    displayRows(allyRowIndexes, "ally")
    displaySeparators()
    displayRows(enemyRows, "enemy")
    columnHelpRow("2")

    const timeAfter = performance.now()
    console.debug(`Time to render battlefield: ${timeAfter - timeNow}ms`)
    return rendered
}