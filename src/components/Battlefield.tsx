import React from 'react';
import example from "../data/example_bf.json"
import {Battlefield as BattlefieldInterface, ParsedBattlefield} from "../types/Battlefield";
import {INVALID_ASSET_PATH, IMAGE_SIZE} from "../config/configs";



const onTileClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    console.log(event.currentTarget.id)
}


const generateAssetPath = (dlc: string, descriptor: string) => {
    return `assets/${dlc}/${descriptor}.png`;
};

const splitDescriptor = (full_descriptor: string): [string, string] => {
    if (!full_descriptor.includes("::")) {
        // If the descriptor does not have specified a dlc, we assume it is a builtins asset
        return ["builtins", full_descriptor]
    }
    return full_descriptor.split("::").length === 2 ?
        full_descriptor.split("::") as [string, string]
        :
        ["builtins", "invalid"]
}

const generateJSX = (dlc: string, descriptor: string, id: string, key: number, onClick?: Function) => {
    return <img
        src={generateAssetPath(dlc, descriptor)}
        onClick={onClick ? (event) => onClick(event) : onTileClick}
        alt={descriptor !== "tile" ? dlc+"::" + descriptor : undefined}
        style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            backgroundImage: "url('assets/builtins/tile.png')",
            backgroundSize: "cover"
        }}
        onError={(event) => {
            event.currentTarget.src = INVALID_ASSET_PATH
            event.currentTarget.alt = "invalid"
        }
        }
        id={id}
        key={key}
    />
}


const parseBattlefield = (data: BattlefieldInterface): ParsedBattlefield => {
    const battlefield = data.battlefield
    const game_descriptors = data.game_descriptors
    const columns: JSX.Element[] = game_descriptors.columns.map((descriptor, index) => {
        return generateJSX(...splitDescriptor(descriptor), `column_${index}`, index)
    })
    const lines = game_descriptors.lines.map((descriptor, index) => {
        return generateJSX(...splitDescriptor(descriptor), `line_${index}`, index)
    })
    const [connectors, separators] = [game_descriptors.connectors, game_descriptors.separators].map((descriptor, index) => {
        return generateJSX(...splitDescriptor(descriptor), index === 0 ? "connector": "separator", index)
    })
    const field_components = game_descriptors.field_components
    const battlefieldJSX: JSX.Element[][] = Array<Array<JSX.Element>>()
    for (let i = 0; i < battlefield.length; i++) {
        const row = []
        for (let j = 0; j < battlefield[i].length; j++) {
            const alias = battlefield[i][j]
            const full_descriptor = field_components[alias]
            let [dlc, descriptor] = splitDescriptor(full_descriptor)
            const tile_id = `${i+1}/${j+1}`
            row.push(generateJSX(dlc, descriptor, tile_id, i * battlefield[i].length + j))
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


const Battlefield = () => {
    const battlefieldStyle = {
        border: "1px solid black",
        display: "grid",
        width: "fit-content",
        height: "fit-content",
        maxWidth: IMAGE_SIZE * 8, // Adjusted to the actual size of the game board
        maxHeight: IMAGE_SIZE * 9, // Adjusted to the actual size of the game board
    }

    const {battlefield, columns, lines, connectors, separators} = parseBattlefield(example)

    const battlefieldToRender = battlefield.map((row, index) => {
        return <div key={index} style={{display: "flex"}}>{row}</div>
    })

    return (
        <div style={battlefieldStyle}>
            {battlefieldToRender}
        </div>
    );
};

export default Battlefield;