import {imgStyle, tileStyle} from "./styles";
import {INVALID_ASSET_PATH} from "../../config/configs";
import React from "react";
import {Battlefield as BattlefieldInterface, ParsedBattlefield} from "../../types/Battlefield";

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


const generateJSXTile = (dlc: string, descriptor: string, id: string, key: number, onClick?: Function) => {
    return <img
        src={generateAssetPath(dlc, descriptor)}
        onClick={onClick ? (event) => onClick(event): undefined}
        alt={descriptor !== "tile" ? dlc + "::" + descriptor : undefined}
        style={tileStyle}
        onError={(event) => {
            event.currentTarget.src = INVALID_ASSET_PATH
            event.currentTarget.alt = "invalid"
        }
        }
        id={id}
        key={key}
    />
}

const generateJSX = (dlc: string, descriptor: string, id: string, key: string | number) => {
    return <img
        src={generateAssetPath(dlc, descriptor)}
        alt={descriptor !== "tile" ? dlc + "::" + descriptor : undefined}
        style={imgStyle}
        onError={(event) => {
            event.currentTarget.src = INVALID_ASSET_PATH
            event.currentTarget.alt = "invalid"
        }
        }
        id={id}
        key={key}
    />
}

export const parseBattlefield = (data: BattlefieldInterface, onClickTile: Function): ParsedBattlefield => {
    const battlefield = data.battlefield
    const game_descriptors = data.game_descriptors
    const columns: JSX.Element[] = game_descriptors.columns.map((descriptor, index) => {
        return generateJSX(...splitDescriptor(descriptor), `column_${index}`, index)
    })
    const lines = game_descriptors.lines.map((descriptor, index) => {
        return generateJSX(...splitDescriptor(descriptor), `line_${index}`, index)
    })
    const [connectors, separators] = [game_descriptors.connectors, game_descriptors.separators].map((descriptor, index) => {
        return (key: string) => generateJSX(...splitDescriptor(descriptor), index === 0 ? "connector" : "separator", key)
    })
    const field_components = game_descriptors.field_components
    const battlefieldJSX: JSX.Element[][] = Array<Array<JSX.Element>>()
    for (let i = 0; i < battlefield.length; i++) {
        const row = []
        for (let j = 0; j < battlefield[i].length; j++) {
            const alias = battlefield[i][j]
            const full_descriptor = field_components[alias]
            let [dlc, descriptor] = splitDescriptor(full_descriptor)
            const tile_id = `${i + 1}/${j + 1}`
            row.push(generateJSXTile(dlc, descriptor, tile_id, i * 10 + j, onClickTile))
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