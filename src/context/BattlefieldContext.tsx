import { Battlefield } from '@type-defs/game-types';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { getCharacterSideWithSquare } from '@utils';

export const AOE_HIGHLIGHT_MODE = {
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
} as const;

type AOEHighlightModeType = keyof typeof AOE_HIGHLIGHT_MODE;

export interface iBattlefieldContext {
    battlefield: {
        [square: string]: {
            info: Battlefield['pawns'][string];
            flags: {
                active: boolean;
                clicked: number;
                interactable: {
                    flag: boolean;
                    type: 'ally' | 'enemy' | 'neutral';
                };
                aoe_highlight: Array<AOEHighlightModeType>;
            };
        };
    };
    changeBattlefield: (
        battlefield: Battlefield,
        options?: {
            keepActive?: boolean;
            keepClicked?: boolean;
            keepInteractable?: boolean;
        },
    ) => void;

    resetActiveSquares: () => void;
    resetInteractableSquares: () => void;
    resetClickedSquares: () => void;

    incrementClickedSquares: (...squares: string[]) => void;
    setInteractableSquares: (...squares: string[]) => void;
    setActiveSquares: (...squares: string[]) => void;

    addAOEHighlight: (squares: Array<string>) => void;

    onClickTile: (square?: string) => void;
    changeOnClickTile: (onClickTile: (square?: string) => void) => void;

    createBonusTileTooltip: (square: string) => ReactNode | null;
    changeBonusTileTooltipGenerator: (func: (square: string) => ReactNode | null) => void;
}

const BattlefieldContext = createContext<iBattlefieldContext | undefined>(undefined);

const DEFAULT_BATTLEFIELD: () => iBattlefieldContext['battlefield'] = () => {
    const res: iBattlefieldContext['battlefield'] = {};
    for (let i = 1; i < 7; i++) {
        for (let j = 1; j < 7; j++) {
            res[`${i}/${j}`] = {
                info: {
                    character: null,
                },
                flags: {
                    active: false,
                    clicked: 0,
                    interactable: {
                        flag: false,
                        type: 'neutral',
                    },
                    aoe_highlight: [],
                },
            };
        }
    }
    return res;
};

const calculateWhichAOEHighlightsToShow = (squares: Array<string>) =>
    squares.reduce(
        (acc, curr) => {
            const [line, column] = curr.split('/').map((value) => parseInt(value, 10));
            let modes = [
                AOE_HIGHLIGHT_MODE.LEFT,
                AOE_HIGHLIGHT_MODE.RIGHT,
                AOE_HIGHLIGHT_MODE.TOP,
                AOE_HIGHLIGHT_MODE.BOTTOM,
            ];
            let neighborLeft = acc[`${line}/${column - 1}`];
            if (neighborLeft) {
                modes = modes.filter((mode) => mode !== AOE_HIGHLIGHT_MODE.LEFT);
                neighborLeft = neighborLeft.filter((mode) => mode !== AOE_HIGHLIGHT_MODE.RIGHT);
            }
            let neighborRight = acc[`${line}/${column + 1}`];
            if (neighborRight) {
                modes = modes.filter((mode) => mode !== AOE_HIGHLIGHT_MODE.RIGHT);
                neighborRight = neighborRight.filter((mode) => mode !== AOE_HIGHLIGHT_MODE.LEFT);
            }
            let neighborTop = acc[`${line - 1}/${column}`];
            if (neighborTop) {
                modes = modes.filter((mode) => mode !== AOE_HIGHLIGHT_MODE.TOP);
                neighborTop = neighborTop.filter((mode) => mode !== AOE_HIGHLIGHT_MODE.BOTTOM);
            }
            let neighborBottom = acc[`${line + 1}/${column}`];
            if (neighborBottom) {
                modes = modes.filter((mode) => mode !== AOE_HIGHLIGHT_MODE.BOTTOM);
                neighborBottom = neighborBottom.filter((mode) => mode !== AOE_HIGHLIGHT_MODE.TOP);
            }
            return {
                ...acc,
                ...(neighborLeft ? { [`${line}/${column - 1}`]: neighborLeft } : {}),
                ...(neighborRight ? { [`${line}/${column + 1}`]: neighborRight } : {}),
                ...(neighborTop ? { [`${line - 1}/${column}`]: neighborTop } : {}),
                ...(neighborBottom ? { [`${line + 1}/${column}`]: neighborBottom } : {}),
                [curr]: [...modes],
            };
        },
        {} as { [key in (typeof squares)[number]]: Array<AOEHighlightModeType> },
    );

export const BattlefieldContextProvider = ({ children }: { children: ReactNode }) => {
    const [battlefield, setBattlefield] = useState<iBattlefieldContext['battlefield']>(DEFAULT_BATTLEFIELD());
    const [onClickTile, setOnClickTile] = useState<iBattlefieldContext['onClickTile']>((_?: string) => () => {});
    const [bonusTileTooltipGenerator, setBonusTileTooltipGenerator] = useState<(square: string) => ReactNode | null>(
        () => () => null,
    );

    const changeOnClickTile = useCallback((onClickTile: (square?: string) => void) => {
        setOnClickTile(() => onClickTile);
    }, []);

    const changeBattlefield = useCallback(
        (
            battlefield: Battlefield,
            options: {
                keepActive?: boolean;
                keepClicked?: boolean;
                keepInteractable?: boolean;
                keepAOEHighlight?: boolean;
            } = {},
        ) => {
            setBattlefield((prev) => {
                const newBattlefield: typeof prev = DEFAULT_BATTLEFIELD();
                for (const square in battlefield.pawns) {
                    newBattlefield[square] = {
                        info: battlefield.pawns[square],
                        flags: {
                            active: options.keepActive ? prev[square]?.flags.active : false,
                            clicked: options.keepClicked ? prev[square]?.flags.clicked : 0,
                            interactable: options.keepInteractable
                                ? prev[square]?.flags.interactable
                                : {
                                      flag: false,
                                      type: 'neutral',
                                  },
                            aoe_highlight: options.keepAOEHighlight ? prev[square]?.flags.aoe_highlight : [],
                        },
                    };
                }
                return newBattlefield;
            });
        },
        [],
    );

    const incrementClickedSquares = useCallback((...squares: string[]) => {
        setBattlefield((prev) => {
            const newBattlefield = { ...prev };
            squares.forEach((square) => {
                newBattlefield[square] = {
                    ...newBattlefield[square],
                    flags: {
                        ...newBattlefield[square].flags,
                        clicked: newBattlefield[square].flags.clicked + 1,
                    },
                };
            });
            return newBattlefield;
        });
    }, []);

    const setInteractableSquares = useCallback((...squares: string[]) => {
        setBattlefield((prev) => {
            const newBattlefield = { ...prev };
            for (const square in newBattlefield) {
                newBattlefield[square] = {
                    ...newBattlefield[square],
                    flags: {
                        ...newBattlefield[square]?.flags,
                        interactable: { flag: false, type: 'neutral' },
                    },
                };
            }
            squares.forEach((square) => {
                newBattlefield[square] = {
                    ...newBattlefield[square],
                    flags: {
                        ...newBattlefield[square]?.flags,
                        interactable: { flag: true, type: getCharacterSideWithSquare(square) ?? 'ally' },
                    },
                };
            });
            return newBattlefield;
        });
    }, []);

    const setActiveSquares = useCallback((...squares: string[]) => {
        setBattlefield((prev) => {
            const newBattlefield = { ...prev };
            for (const square in newBattlefield) {
                newBattlefield[square] = {
                    ...newBattlefield[square],
                    flags: {
                        ...newBattlefield[square].flags,
                        active: false,
                    },
                };
            }
            squares.forEach((square) => {
                newBattlefield[square] = {
                    ...newBattlefield[square],
                    flags: {
                        ...newBattlefield[square].flags,
                        active: true,
                    },
                };
            });
            return newBattlefield;
        });
    }, []);

    const resetActiveSquares = useCallback(() => {
        setBattlefield((prev) => {
            const newBattlefield = { ...prev };
            for (const square in newBattlefield) {
                newBattlefield[square] = {
                    ...newBattlefield[square],
                    flags: {
                        ...newBattlefield[square].flags,
                        active: false,
                    },
                };
            }
            return newBattlefield;
        });
    }, []);

    const resetInteractableSquares = useCallback(() => {
        setBattlefield((prev) => {
            const newBattlefield = { ...prev };
            for (const square in newBattlefield) {
                newBattlefield[square] = {
                    ...newBattlefield[square],
                    flags: {
                        ...newBattlefield[square].flags,
                        interactable: { flag: false, type: 'neutral' },
                    },
                };
            }
            return newBattlefield;
        });
    }, []);

    const resetClickedSquares = useCallback(() => {
        setBattlefield((prev) => {
            const newBattlefield = { ...prev };
            for (const square in newBattlefield) {
                newBattlefield[square] = {
                    ...newBattlefield[square],
                    flags: {
                        ...newBattlefield[square].flags,
                        clicked: 0,
                    },
                };
            }
            return newBattlefield;
        });
    }, []);

    const addAOEHighlight = useCallback((squares: Array<string>) => {
        setBattlefield((prev) => {
            const newBattlefield = { ...prev };
            const newAOEHighlights = {
                ...calculateWhichAOEHighlightsToShow(
                    squares.filter((square) => getCharacterSideWithSquare(square) === 'ally'),
                ),
                ...calculateWhichAOEHighlightsToShow(
                    squares.filter((square) => getCharacterSideWithSquare(square) === 'enemy'),
                ),
            };
            for (const square of Object.keys(newBattlefield)) {
                newBattlefield[square] = {
                    ...newBattlefield[square],
                    flags: {
                        ...newBattlefield[square].flags,
                        aoe_highlight: newAOEHighlights[square] || [],
                    },
                };
            }
            return newBattlefield;
        });
    }, []);

    const generateLeftTileTooltip = useCallback(
        (square: string) => {
            return bonusTileTooltipGenerator(square);
        },
        [bonusTileTooltipGenerator],
    );

    const changeBonusTileTooltipGenerator = useCallback((func: (square: string) => ReactNode | null) => {
        setBonusTileTooltipGenerator(() => func);
    }, []);

    const context = useMemo(
        () => ({
            battlefield,
            changeBattlefield,

            resetActiveSquares,
            resetInteractableSquares,
            resetClickedSquares,

            incrementClickedSquares,
            setInteractableSquares,
            setActiveSquares,

            addAOEHighlight,

            onClickTile,
            changeOnClickTile,

            createBonusTileTooltip: generateLeftTileTooltip,
            changeBonusTileTooltipGenerator: changeBonusTileTooltipGenerator,
        }),
        [
            battlefield,
            changeBattlefield,
            resetActiveSquares,
            resetInteractableSquares,
            resetClickedSquares,
            incrementClickedSquares,
            setInteractableSquares,
            setActiveSquares,
            addAOEHighlight,
            onClickTile,
            changeOnClickTile,
            generateLeftTileTooltip,
            changeBonusTileTooltipGenerator,
        ],
    );

    return <BattlefieldContext.Provider value={context}>{children}</BattlefieldContext.Provider>;
};

export const useBattlefieldContext = () => {
    const context = useContext(BattlefieldContext);
    if (context === undefined) {
        throw new Error('useBattlefieldContext must be used within a BattlefieldContextProvider.');
    }
    return context as iBattlefieldContext;
};
