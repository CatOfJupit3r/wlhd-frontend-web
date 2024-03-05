import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {INVALID_ASSET_PATH} from "../../config/configs";
import {generateAssetPath, splitDescriptor} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveSquares, selectChosenSquare, selectSquareChoice, setChosenSquare} from "../../redux/slices/turnSlice";
import styles from "./Tiles.module.css";
import { Tooltip } from 'react-tooltip'
import {OverlayTrigger, Placeholder} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import useLocalization from "../../hooks/useLocalization";


const TileEntity = (props: {
    full_descriptor: string,
    className?: string,
    id: string,
    fallback: {
        path: string,
        alt?: string
    }
}) => {
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const localize = useLocalization()

    const {
        full_descriptor,
        className,
        id,
        fallback} = props;
    const [dlc, descriptor] = splitDescriptor(full_descriptor)

    const [currentClassAlias, setCurrentClassAlias] = useState("default")

    const chosenSquare = useSelector(selectChosenSquare)
    const isSquareChoice = useSelector(selectSquareChoice)
    const activeSquares = useSelector(selectActiveSquares)

    const squareShouldBeInteractable = useCallback(() => {
        const [line, column] = id.split("/")
        return activeSquares[line]?.[column] &&
            activeSquares[line][column] !== undefined &&
            activeSquares[line][column] &&
            isSquareChoice
    }, [activeSquares, id, isSquareChoice])

    const classAliasToName = (alias: string) => {
        let result
        switch (alias) {
            case "interactable":
                result = `${styles.tile} ${styles.interactable} ${styles.withEntity}`
                break;
            case "active":
                result = `${styles.tile} ${styles.selected} ${styles.withEntity}`
                break;
            default:
                result = descriptor === "tile" ? `${styles.tile}` : `${styles.tile} ${styles.withEntity}`
                break;
        }
        return result + (className ? ` ${className}` : "")
    }

    const handleTileClick = () => {
        if (currentClassAlias !== "default" && isSquareChoice) {
            if (chosenSquare !== id) {
                dispatch(setChosenSquare({
                    square: id
                }))
            } else {
                dispatch(setChosenSquare({
                    square: ""
                }))
            }
        }
    }

    useEffect(() => {
        if (chosenSquare === id) {
            setCurrentClassAlias("active")
        } else if (squareShouldBeInteractable()) {
            setCurrentClassAlias("interactable")
        } else {
            setCurrentClassAlias("default")
        }
    }, [chosenSquare, activeSquares, isSquareChoice, id, squareShouldBeInteractable])

    const generatePlaceholder = (key: string) => {
        return <Placeholder as="p" animation="glow" style={{
            marginBottom: key === t("game:components:tooltip:status_effects") ? "0" : "7px"
        }} key={key}>
            <Placeholder bg="light"> {t(key)} </Placeholder>
        </Placeholder>
    }

    return <>
        <img
            src={generateAssetPath(dlc, descriptor)}
            onClick={() => handleTileClick()}
            alt={descriptor !== "tile" ? dlc + "::" + descriptor : undefined}
            onError={(event) => {
                event.currentTarget.src = fallback.path ? fallback.path : INVALID_ASSET_PATH
                event.currentTarget.alt = fallback.alt ? fallback.alt : "invalid"
            }}
            className={className && currentClassAlias === "default" ? undefined : classAliasToName(currentClassAlias)}
            id={id}
            key={id}
            data-tooltip-id={id}
        />
        {
            descriptor !== "tile" ?
                <Tooltip
                    id={id}
                    place={"left-start"}
                    opacity={0.95}
                    variant={"dark"}
                    delayShow={isSquareChoice ? 1500 : 500}
                >
                        {
                            [
                                t("game:components:tooltip:creature_and_line"),
                                t("game:components:tooltip:health_max_health"),
                                t("game:components:tooltip:action_points"),
                                t("game:components:tooltip:armor"),
                                t("game:components:tooltip:status_effects")
                            ].map((key) => generatePlaceholder(key))
                        }
                </Tooltip>
                :
                null
        }
    </>
}

export default TileEntity;