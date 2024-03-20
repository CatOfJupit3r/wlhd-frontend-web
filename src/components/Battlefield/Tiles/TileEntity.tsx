import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {INVALID_ASSET_PATH} from "../../../config/configs";
import {generateAssetPath, splitDescriptor} from "../utils";
import {useDispatch, useSelector} from "react-redux";
import styles from "./Tiles.module.css";
import { Tooltip } from 'react-tooltip'
import {Placeholder} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {selectEntitiesInfo, selectIsLoadingBattlefield} from "../../../redux/slices/infoSlice";
import {
    addHighlightedComponent,
    selectHighlightedComponents,
    selectIsSquareChoice,
    setChosenAction,
    setSquareChoice
} from "../../../redux/slices/turnSlice";


const TileEntity = (props: {
    full_descriptor: string,
    className?: string,
    id: string,
    active_tiles: {[key: string]: boolean},
    fallback: {
        path: string,
        alt?: string
    }
}) => {
    const dispatch = useDispatch()
    const {t} = useTranslation()

    const {
        full_descriptor,
        className,
        id,
        fallback} = props;
    const [dlc, descriptor] = splitDescriptor(full_descriptor)

    const [currentClassAlias, setCurrentClassAlias] = useState("default")

    const isSquareChoice = useSelector(selectIsSquareChoice)
    const isLoadingBattlefield = useSelector(selectIsLoadingBattlefield)
    const entities_info = useSelector(selectEntitiesInfo)
    const highlightedComponents = useSelector(selectHighlightedComponents)

    const [activeTiles, setActiveTiles] = useState(props.active_tiles)

    useEffect(() => {
        setActiveTiles(props.active_tiles)
    }, [props.active_tiles, setActiveTiles])

    const squareShouldBeInteractable = useCallback(() => {
        if (!isSquareChoice) {
            return false
        } else {
            if (id in activeTiles && activeTiles[id]) {
                return true
            }
        }
        return false
    }, [id, isSquareChoice, activeTiles])

    const classAliasToName = useCallback((alias: string) => {
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
    }, [className, descriptor])

    const handleDoubleClick = useCallback(() => {
        if (isSquareChoice && id in activeTiles && activeTiles[id]) {
            dispatch(addHighlightedComponent(id))
            dispatch(
                setChosenAction({
                    chosenActionValue: id,
                    translatedActionValue: id
                })
            )
            dispatch(setSquareChoice(false))
        }
    }, [id, isSquareChoice, dispatch, activeTiles])

    useEffect(() => {
        if (
            highlightedComponents && highlightedComponents[id] > 0
        ) {
            setCurrentClassAlias("active")
        }
        else if (squareShouldBeInteractable()) {
            setCurrentClassAlias("interactable")
        } else {
            setCurrentClassAlias("default")
        }
    }, [highlightedComponents, id, squareShouldBeInteractable])

    const generatePlaceholder = useCallback((key: string, glow: boolean = true) => {
        return <Placeholder as="p" animation={glow ? "glow" : undefined} style={{
            marginBottom: key === t("game:components:tooltip:status_effects") ? "0" : "7px"
        }} key={key}>
            <Placeholder bg="light"> {t(key)} </Placeholder>
        </Placeholder>
    }, [t])

    const emptyTooltipContent = useMemo(() => {
        return [
            t("game:components:tooltip:creature_and_line"),
            t("game:components:tooltip:health_max_health"),
            t("game:components:tooltip:action_points"),
            t("game:components:tooltip:armor"),
            t("game:components:tooltip:status_effects", {status_effects: t("game:components:tooltip:no_status_effects")})
        ]
    }, [t])

    const generateTooltipContent = useCallback(() => {
        const entity_info = entities_info ? entities_info[id] : undefined
        if (!entities_info || !entity_info) {
            return emptyTooltipContent.map((key) => <>
                {generatePlaceholder(key, false)}
                <Placeholder as="br" animation="glow"/>
            </>)
        }
        const {
            name,
            line,
            column,
            current_health,
            max_health,
            current_action_points,
            max_action_points,
            current_armor,
            base_armor,
            status_effects
        } = entity_info
        return [
            t("local:game.components.tooltip.creature_and_line", {name: t(name), line, column}),
            t("local:game.components.tooltip.health_max_health", {current_health, max_health}),
            t("local:game.components.tooltip.action_points", {current_action_points, max_action_points}),
            t("local:game.components.tooltip.armor", {current_armor, base_armor}),
            t("local:game.components.tooltip.status_effects",
                {status_effects: (
                        status_effects && status_effects.length > 0 ?
                        status_effects.map(([name, duration]) => `${t([name])} (${duration})`).join(", ") :
                        t("local:game.components.tooltip.no_status_effects")
                    )})
        ].map((key) => <p key={key}>{key}</p>)
    }, [entities_info, emptyTooltipContent, t, id, generatePlaceholder])

    return <>
        <img
            src={generateAssetPath(dlc, descriptor)}
            onDoubleClick={handleDoubleClick}
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
                    delayHide={0}
                >
                        {
                            isLoadingBattlefield ?
                                emptyTooltipContent.map((key) => generatePlaceholder(key))
                            :
                            <div>
                                {
                                    generateTooltipContent()
                                }
                            </div>
                        }
                </Tooltip>
                :
                null
        }
    </>
}

export default TileEntity;