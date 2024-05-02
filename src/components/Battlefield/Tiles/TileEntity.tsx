import { useCallback, useEffect, useMemo, useState } from 'react'
import { Placeholder } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip } from 'react-tooltip'
import { INVALID_ASSET_PATH } from '../../../config/configs'
import useTranslatableString from '../../../hooks/useTranslatableString'
import {
    selectBattlefieldMode,
    selectInteractableTiles,
    setClickedSquare,
} from '../../../redux/slices/battlefieldSlice'
import { selectEntityTooltips } from '../../../redux/slices/infoSlice'
import { addHighlightedComponent, selectHighlightedComponents } from '../../../redux/slices/turnSlice'
import { generateAssetPath, splitDescriptor } from '../utils'
import styles from './Tiles.module.css'

const TileEntity = (props: {
    full_descriptor: string
    className?: string
    id: string
    fallback: {
        path: string
        alt?: string
    }
}) => {
    const dispatch = useDispatch()
    const tString = useTranslatableString()
    const { t } = useTranslation()

    const { full_descriptor, className, id, fallback } = props
    const [dlc, descriptor] = splitDescriptor(full_descriptor)

    const [currentClassAlias, setCurrentClassAlias] = useState('default')

    const battlefieldMode = useSelector(selectBattlefieldMode)
    const entities_info = useSelector(selectEntityTooltips)
    const highlightedComponents = useSelector(selectHighlightedComponents)

    const interactableTiles = useSelector(selectInteractableTiles)

    const squareShouldBeInteractable = useCallback(() => {
        if (battlefieldMode !== 'selection') {
            return false
        } else {
            if (id in interactableTiles && interactableTiles[id]) {
                return true
            }
        }
        return false
    }, [id, interactableTiles, battlefieldMode])

    const classAliasToName = useCallback(
        (alias: string) => {
            let result
            switch (alias) {
                case 'interactable':
                    result = `${styles.tile} ${styles.interactable} ${styles.withEntity}`
                    break
                case 'active':
                    result = `${styles.tile} ${styles.selected} ${styles.withEntity}`
                    break
                default:
                    result = descriptor === 'tile' ? `${styles.tile}` : `${styles.tile} ${styles.withEntity}`
                    break
            }
            return result + (className ? ` ${className}` : '')
        },
        [className, descriptor]
    )

    const handleDoubleClick = useCallback(() => {
        if (battlefieldMode === 'selection') {
            dispatch(addHighlightedComponent(id))
            dispatch(setClickedSquare(id))
        }
    }, [id, dispatch, interactableTiles])

    useEffect(() => {
        if (highlightedComponents && highlightedComponents[id] > 0) {
            setCurrentClassAlias('active')
        } else if (squareShouldBeInteractable()) {
            setCurrentClassAlias('interactable')
        } else {
            setCurrentClassAlias('default')
        }
    }, [highlightedComponents, id, squareShouldBeInteractable])

    const generatePlaceholder = useCallback(
        (key: string, glow: boolean = true) => {
            return (
                <Placeholder
                    as="p"
                    animation={glow ? 'glow' : undefined}
                    style={{
                        marginBottom: key === t('game:components:tooltip:status_effects') ? '0' : '7px',
                    }}
                    key={key}
                >
                    <Placeholder bg="light"> {t(key)} </Placeholder>
                </Placeholder>
            )
        },
        [t]
    )

    const emptyTooltipContent = useMemo(() => {
        return [
            t('game:components:tooltip:creature_and_line'),
            t('game:components:tooltip:health_max_health'),
            t('game:components:tooltip:action_points'),
            t('game:components:tooltip:armor'),
            t('game:components:tooltip:status_effects', {
                status_effects: t('game:components:tooltip:no_status_effects'),
            }),
        ]
    }, [t])

    const generateTooltipContent = useCallback(() => {
        const entity_info = entities_info ? entities_info[id] : undefined
        if (!entities_info || !entity_info) {
            return emptyTooltipContent.map((key) => (
                <>
                    {generatePlaceholder(key, false)}
                    <Placeholder as="br" animation="glow" />
                </>
            ))
        }
        const { name, square, health, action_points, armor, status_effects } = entity_info
        return [
            t('local:game.components.tooltip.creature_and_line', {
                name: tString(name),
                square: `${square.line}|${square.column}`,
            }),
            t('local:game.components.tooltip.health_max_health', {
                current_health: health.current,
                max_health: health.max,
            }),
            t('local:game.components.tooltip.action_points', {
                current_action_points: action_points.current,
                max_action_points: action_points.max,
            }),
            t('local:game.components.tooltip.armor', { current_armor: armor.current, base_armor: armor.base }),
            t('local:game.components.tooltip.status_effects', {
                status_effects: (() => {
                    return status_effects && status_effects.length > 0
                        ? status_effects.map((value) => `${tString(value.descriptor)} (${value.duration})`).join(', ')
                        : t('local:game.components.tooltip.no_status_effects')
                })(),
            }),
        ].map((key, index) => <p key={index}>{key}</p>)
    }, [entities_info, emptyTooltipContent, t, id, generatePlaceholder])

    return (
        <>
            <img
                src={generateAssetPath(dlc, descriptor)}
                onDoubleClick={handleDoubleClick}
                alt={descriptor !== 'tile' ? dlc + ':' + descriptor : undefined}
                onError={(event) => {
                    event.currentTarget.src = fallback.path ? fallback.path : INVALID_ASSET_PATH
                    event.currentTarget.alt = fallback.alt ? fallback.alt : 'invalid'
                }}
                className={
                    className && currentClassAlias === 'default' ? undefined : classAliasToName(currentClassAlias)
                }
                id={id}
                key={id}
                data-tooltip-id={id}
            />
            {descriptor !== 'tile' ? (
                <Tooltip
                    id={id}
                    place={'left-start'}
                    opacity={0.95}
                    variant={'dark'}
                    delayShow={battlefieldMode === 'selection' ? 1500 : 500}
                    delayHide={0}
                >
                    <div>{generateTooltipContent()}</div>
                </Tooltip>
            ) : null}
        </>
    )
}

export default TileEntity
