import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { INVALID_ASSET_PATH } from '../../../config/configs'
import {
    selectBattlefieldMode,
    selectInteractableTiles,
    setClickedSquare,
} from '../../../redux/slices/battlefieldSlice'
import { selectActiveEntity } from '../../../redux/slices/infoSlice'
import { addHighlightedComponent, selectHighlightedComponents } from '../../../redux/slices/turnSlice'
import { generateAssetPath, splitDescriptor } from '../utils'
import Decoration, { DecorationConfig } from './Decoration/Decoration'
import EntityTooltip from './EntityTooltip/EntityTooltip'
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

    const { full_descriptor, className, id, fallback } = props
    const [dlc, descriptor] = splitDescriptor(full_descriptor)

    const [showTooltip, setShowTooltip] = useState(false)
    const [decorations, setDecorations] = useState({
        interactable: {
            flag: false,
            type: 'neutral',
        },
        clicked: {
            flag: false,
            times: 0,
        },
        active: false,
    } as DecorationConfig)

    const battlefieldMode = useSelector(selectBattlefieldMode)
    const highlightedComponents = useSelector(selectHighlightedComponents)
    const interactableTiles = useSelector(selectInteractableTiles)
    const activeEntity = useSelector(selectActiveEntity)

    const changeDecoration = useCallback((
        key: 'interactable' | 'clicked' | 'active',
        value: { flag: boolean; type: 'ally' | 'enemy' | 'neutral' } | { flag: boolean; times: number } | boolean
    ) => {
        setDecorations((prev) => {
            return {
                ...prev,
                [key]: value,
            }
        })
    }, [])

    const handleMouseEnter = () => {
        setShowTooltip(true)
    }

    const handleMouseLeave = () => {
        setShowTooltip(false)
    }

    const squareShouldBeInteractable = useCallback(() => {
        if (battlefieldMode !== 'selection') return false
        else {
            if (id in interactableTiles && interactableTiles[id]) return true
        } return false
    }, [id, interactableTiles, battlefieldMode])

    const handleDoubleClick = useCallback(() => {
        if (battlefieldMode === 'selection' && squareShouldBeInteractable()) {
            dispatch(addHighlightedComponent(id))
            dispatch(setClickedSquare(id))
        }
    }, [id, dispatch, interactableTiles])

    useEffect(() => {
        if (highlightedComponents && highlightedComponents[id] > 0) {
            changeDecoration('clicked', { flag: true, times: highlightedComponents[id] })
        } else changeDecoration('clicked', { flag: false, times: 0 })
    }, [highlightedComponents, id])

    useEffect(() => {
        if (squareShouldBeInteractable()) {
            changeDecoration('interactable', {
                flag: true,
                type: id.split('/')[0] in [1, 2, 3] ? 'enemy' : 'ally',
            })
        } else changeDecoration('interactable', { flag: false, type: 'neutral' })
    }, [interactableTiles, battlefieldMode, id])

    useEffect(() => {
        if (!activeEntity) {
            if (decorations.active) changeDecoration('active', false)
            return
        }
        const { line, column } = activeEntity.square
        if (`${line}/${column}` === id) changeDecoration('active', true)
        else changeDecoration('active', false)
    }, [activeEntity])

    return (
        <div
            className={`${styles.entityContainer} ${descriptor !== 'tile' ? styles.withEntity : ''}`}
            onDoubleClick={handleDoubleClick}
            id={`square_${id}`}
            key={id}
        >
            <Decoration decoration={decorations} />
            <img
                src={generateAssetPath(dlc, descriptor)}
                alt={descriptor !== 'tile' ? dlc + ':' + descriptor : undefined}
                onError={(event) => {
                    event.currentTarget.src = fallback.path ? fallback.path : INVALID_ASSET_PATH
                    event.currentTarget.alt = fallback.alt ? fallback.alt : 'invalid'
                }}
                id={id}
                className={styles.tile + (className ? ` ${className}` : '')}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            {showTooltip && (descriptor !== 'tile' ? <EntityTooltip id={id} /> : null)}
        </div>
    )
}

export default TileEntity
