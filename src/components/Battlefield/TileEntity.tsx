import React, {useEffect, useState} from 'react';
import {tileInteractableStyle} from "./styles";
import {INVALID_ASSET_PATH} from "../../config/configs";
import {generateAssetPath, splitDescriptor} from "./utils";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveCells, selectChosenCell, selectSquareChoice, setChosenCell} from "../../redux/slices/turnSlice";
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
    const chosenCell = useSelector(selectChosenCell)
    const isSquareChoice = useSelector(selectSquareChoice)
    const activeCells = useSelector(selectActiveCells)
    const [currentClassAlias, setCurrentClassAlias] = useState("default")

    const squareShouldBeInteractable = () => {
        const [line, column] = id.split("/")
        return activeCells[line]?.[column] &&
            activeCells[line][column] !== undefined &&
            activeCells[line][column] &&
            isSquareChoice
    }

    const updateClassName = () => {
        if (chosenCell === id) {
            setCurrentClassAlias("active")
        } else if (squareShouldBeInteractable()) {
            setCurrentClassAlias("interactable")
        } else {
            setCurrentClassAlias("default")
        }
    }

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
            if (chosenCell !== id) {
                dispatch(setChosenCell({
                    cell: id
                }))
            } else {
                dispatch(setChosenCell({
                    cell: ""
                }))
            }
        }
    }

    useEffect(() => {
        updateClassName()
    }, [chosenCell, activeCells, isSquareChoice, id])

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