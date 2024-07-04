import React from 'react'
import { generateAssetPath, splitDescriptor } from '../utils'
import styles from './Tiles.module.css'
import GameAsset from '@components/GameAsset'

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
            src={generateAssetPath(dlc, descriptor)}
            onClick={onClick ? onClick : undefined}
            alt={descriptor !== 'tile' ? dlc + ':' + descriptor : undefined}
            className={className ? `${className} ${styles.tile}` : styles.tile}
            id={id}
            key={id}
        />
    )
}

export default TileCosmetic
