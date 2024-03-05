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
    columns: (key: string) => JSX.Element[];
    lines: (key: string) => JSX.Element[];
    connectors: (key: string) => JSX.Element;
    separators: (key: string) => JSX.Element;
}

/*
{
    "123123": [
        ["builtins::item_usage", [["nyrzamaer::dortyn:name"], ["nyrzamaer::aridnik_blades:name"], "3", "6"]],
        ["builtins::creature_takes_damage", [["nyrzamaer::target_dummy_large:name"], "7", ["builtins::physical"]]],
        ["builtins::creature_fainted", [["nyrzamaer::target_dummy_large:name"]]],
    ],
},
 */

export interface GameStateMessages {
    [key: string]: Array<
        [
            string,
            Array<string | Array<string>> | undefined
        ]
    >
}