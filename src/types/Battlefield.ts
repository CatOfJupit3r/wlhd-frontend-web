import exp from "node:constants";

export interface Battlefield {
    battlefield: string[][];
    game_descriptors: {
        columns: string[];
        lines: string[];
        connectors: string;
        separators: string;
        field_components: {
            [key: string]: string;
        }
    }
}

export interface ParsedBattlefield {
    battlefield: JSX.Element[][];
    columns: JSX.Element[];
    lines: JSX.Element[];
    connectors: JSX.Element;
    separators: JSX.Element;
}