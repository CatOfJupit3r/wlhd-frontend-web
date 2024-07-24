import GameAsset from '@components/GameAsset'
import React from 'react'
import { splitDescriptor } from '../utils'
import styles from './Tiles.module.css'

const TileCosmetic = (props: {
    full_descriptor: string
    onClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent> | undefined) => undefined
    className?: string
    id: string
}) => {
    const { full_descriptor, onClick, className, id } = props
    const [dlc, descriptor] = splitDescriptor(full_descriptor)

    return (
        <GameAsset
            src={{ dlc, descriptor }}
            onClick={onClick ? onClick : undefined}
            alt={descriptor !== 'tile' ? dlc + ':' + descriptor : undefined}
            className={className ? `${className} ${styles.tile}` : styles.tile}
            id={id}
            key={id}
        />
    )
}

export default TileCosmetic
