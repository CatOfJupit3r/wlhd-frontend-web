import GameAsset from '@components/GameAsset'
import {
    selectBattlefieldMode,
    selectFieldComponents,
    selectClickedSquares,
    selectInteractableTiles,
    setClickedSquare,
} from '@redux/slices/battlefieldSlice'
import { selectActiveEntity } from '@redux/slices/infoSlice'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateAssetPathFullDescriptor, splitDescriptor } from '../utils'
import Decoration, { DecorationConfig } from './Decoration/Decoration'
import EntityTooltip from './EntityTooltip/EntityTooltip'
import styles from './Tiles.module.css'
import { cn } from '@lib/utils'

const TileEntity = (props: {
    full_descriptor: string
    className?: string
    id: string
    fallback: {
        src: string
        alt?: string
    }
}) => {
    const dispatch = useDispatch()

    const { full_descriptor, className, id, fallback } = props
    const [dlc, descriptor] = useMemo(() => splitDescriptor(full_descriptor), [full_descriptor])

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
    const interactableTiles = useSelector(selectInteractableTiles)
    const activeEntity = useSelector(selectActiveEntity)
    const pawns = useSelector(selectFieldComponents)
    const clickedComponents = useSelector(selectClickedSquares)

    const changeDecoration = useCallback(
        (
            key: 'interactable' | 'clicked' | 'active',
            value: { flag: boolean; type: 'ally' | 'enemy' | 'neutral' } | { flag: boolean; times: number } | boolean
        ) => {
            setDecorations((prev) => {
                return {
                    ...prev,
                    [key]: value,
                }
            })
        },
        []
    )

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
        }
        return false
    }, [id, interactableTiles, battlefieldMode])

    const handleDoubleClick = useCallback(() => {
        if (battlefieldMode === 'selection' && squareShouldBeInteractable()) {
            dispatch(setClickedSquare(id))
        }
    }, [id, interactableTiles])

    useEffect(() => {
        if (clickedComponents && clickedComponents[id] > 0) {
            changeDecoration('clicked', { flag: true, times: clickedComponents[id] })
        } else changeDecoration('clicked', { flag: false, times: 0 })
    }, [clickedComponents, id])

    useEffect(() => {
        if (squareShouldBeInteractable()) {
            changeDecoration('interactable', {
                flag: true,
                type: ['1', '2', '3'].includes(id.split('/')[0]) ? 'enemy' : 'ally',
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
            className={cn(
                'relative',
                descriptor !== 'tile' ? 'bg-cover' : '',
                squareShouldBeInteractable() ? 'cursor-pointer' : 'cursor-default'
            )}
            onDoubleClick={handleDoubleClick}
            id={`square_${id}`}
            key={id}
            style={
                descriptor !== 'tile'
                    ? {
                          backgroundImage: `url(${generateAssetPathFullDescriptor(pawns['0'])})`,
                      }
                    : {}
            }
        >
            <Decoration decoration={decorations} />
            <GameAsset
                src={{
                    dlc,
                    descriptor,
                }}
                alt={descriptor !== 'tile' ? dlc + ':' + descriptor : undefined}
                fallback={{
                    src: fallback.src,
                    alt: fallback.alt ? fallback.alt : dlc + ':' + descriptor,
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
