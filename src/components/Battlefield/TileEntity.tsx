import React, {useCallback, useEffect, useState} from 'react';
import {tileInteractableStyle} from "./styles";
import {INVALID_ASSET_PATH} from "../../config/configs";
import {generateAssetPath, splitDescriptor} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveSquares, selectChosenSquare, selectSquareChoice, setChosenSquare} from "../../redux/slices/turnSlice";
import styles from "./Battlefield.module.css";

const TileEntity = (props: {
    full_descriptor: string,
    className?: string,
    id: string,
    fallback: {
        path: string,
        alt?: string
    }
}) => {
    const {
        full_descriptor,
        className,
        id,
        fallback} = props;
    const [dlc, descriptor] = splitDescriptor(full_descriptor)
    const dispatch = useDispatch()
    const chosenSquare = useSelector(selectChosenSquare)
    const isSquareChoice = useSelector(selectSquareChoice)
    const activeSquares = useSelector(selectActiveSquares)
    const [currentClassAlias, setCurrentClassAlias] = useState("default")

    const squareShouldBeInteractable = useCallback(() => {
        const [line, column] = id.split("/")
        return activeSquares[line]?.[column] &&
            activeSquares[line][column] !== undefined &&
            activeSquares[line][column] &&
            isSquareChoice
    }, [activeSquares, id, isSquareChoice])

    const classAliasToName = (alias: string) => {
        switch (alias) {
            case "interactable":
                return className ? `${className} ${styles.interactableTile}` : styles.interactableTile
            case "active":
                return className ? `${className} ${styles.activeTile}` : styles.activeTile
            default:
                return className ? className : ""
        }
    }

    const handleTileClick = () => {
        if (currentClassAlias !== "default") {
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

    return <img
        src={generateAssetPath(dlc, descriptor)}
        onClick={() => handleTileClick()}
        alt={descriptor !== "tile" ? dlc + "::" + descriptor : undefined}
        style={tileInteractableStyle}
        onError={(event) => {
            event.currentTarget.src = fallback.path ? fallback.path : INVALID_ASSET_PATH
            event.currentTarget.alt = fallback.alt ? fallback.alt : "invalid"
        }
        }
        className={className && currentClassAlias === "default" ? undefined : classAliasToName(currentClassAlias)}
        id={id}
        key={id}
    />
}

export default TileEntity;