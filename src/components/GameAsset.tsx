import { INVALID_ASSET_PATH } from 'config'
import React from 'react'
import { generateAssetPath, generateAssetPathFullDescriptor } from '@components/Battlefield/utils'

const SET_ASSET_PROPS = (img: HTMLImageElement, fallback: { src: string; alt: string }) => {
    if (img.src === fallback.src || img.src === INVALID_ASSET_PATH) return
    img.src = fallback.src || INVALID_ASSET_PATH
    img.alt = fallback.alt || 'invalid asset'
}

interface GameAssetProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string | { dlc: string; descriptor: string }
    fallback?: {
        src: string
        alt: string
    }
}

const GameAsset = ({ src, fallback, ...props }: GameAssetProps) => {
    return (
        <img
            {...props}
            src={
                typeof src === 'string'
                    ? generateAssetPathFullDescriptor(src)
                    : generateAssetPath(src.dlc, src.descriptor)
            }
            onError={(e) => {
                if (e.currentTarget.src === INVALID_ASSET_PATH) return
                SET_ASSET_PROPS(e.currentTarget, fallback || { src: INVALID_ASSET_PATH, alt: 'invalid asset' })
            }}
        />
    )
}

export default GameAsset
