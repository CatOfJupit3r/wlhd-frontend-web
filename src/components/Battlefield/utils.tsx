import React from "react";
import TileCosmetic from "./Tiles/TileCosmetic";
import TileEntity from "./Tiles/TileEntity";

export const generateAssetPath = (dlc: string, descriptor: string) => {
    return `assets/${dlc}/${descriptor}.png`;
};

export const splitDescriptor = (full_descriptor: string): [string, string] => {
    if (!full_descriptor) {
        console.log("Descriptor is undefined")
        return ["builtins", "invalid"]
    }
    if (!full_descriptor.includes(":")) {
        // If the descriptor does not have specified a dlc, we assume it is a builtins asset
        return ["builtins", full_descriptor]
    }
    return full_descriptor.split(":").length === 2 ?
        full_descriptor.split(":") as [string, string]
        :
        ["builtins", "invalid"]
}


export const CONNECTORS = (descriptor: string, key: string) => {
    return <TileCosmetic full_descriptor={descriptor} id={"connector_" + key} key={key} />
}

export const SEPARATORS = (descriptor: string, key: string) => {
    return <TileCosmetic full_descriptor={descriptor} id={"separator_" + key} key={key} />
}

export const COLUMN = (descriptor: string, key: string) => {
    return <TileCosmetic full_descriptor={descriptor} id={"column_" + key} key={key} />
}

export const COLUMNS_ARRAY = (columns: string[]) => {
    return columns.map((descriptor, index) => COLUMN(descriptor, index.toString()))
}

export const LINE = (descriptor: string, key: string) => {
    return <TileCosmetic full_descriptor={descriptor} id={"line_" + key} key={key} />
}

export const LINES_ARRAY = (lines: string[], key: string) => {
    return lines.map((descriptor, index) => LINE(descriptor, `${index.toString()}_${key}`))
}


export const JSX_BATTLEFIELD = (
    battlefield: string[][],
    field_components: {[key: string]: string},
    active_tiles: {[key: string]: boolean}
) => {
    const battlefieldJSX: JSX.Element[][] = Array<Array<JSX.Element>>()
    for (let i = 0; i < battlefield.length; i++) {
        const row = []
        for (let j = 0; j < battlefield[i].length; j++) {
            const alias = battlefield[i][j]
            const full_descriptor = field_components[alias]
            const tile_id = `${i + 1}/${j + 1}`
            const isAlly = i + 1 > Math.floor(battlefield.length / 2)
            row.push(
                <TileEntity
                    full_descriptor={full_descriptor}
                    id={tile_id}
                    key={tile_id}
                    active_tiles={active_tiles}
                    fallback={{
                        path: isAlly ? "assets/builtins/ally.png" : "assets/builtins/enemy.png",
                        alt: isAlly ? "ally" : "enemy"
                    }}
                />
            )
        }
        battlefieldJSX.push(row)
    }
    return battlefieldJSX
}
