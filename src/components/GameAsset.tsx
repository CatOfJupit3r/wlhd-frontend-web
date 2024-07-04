import React, { CSSProperties } from 'react'
import { INVALID_ASSET_PATH } from 'config'

const SET_ASSET_PROPS = (img: HTMLImageElement, fallback: { src: string; alt: string }) => {
    img.src = fallback.src || INVALID_ASSET_PATH
    img.alt = fallback.alt || 'invalid asset'
}

const GameAsset = ({
    src,
    alt,
    onClick,
    id,
    onMouseEnter,
    onMouseLeave,
    className,
    style,
    fallback,
}: {
    src: string
    alt?: string
    onClick?: React.MouseEventHandler<HTMLImageElement> | undefined
    onMouseEnter?: React.MouseEventHandler<HTMLImageElement> | undefined
    onMouseLeave?: React.MouseEventHandler<HTMLImageElement> | undefined
    id?: string
    className?: string
    style?: CSSProperties
    fallback?: {
        src: string
        alt: string
    }
}) => {
    return (
        <img
            src={src}
            alt={alt}
            onClick={onClick ? onClick : undefined}
            onMouseEnter={onMouseEnter ? onMouseEnter : undefined}
            onMouseLeave={onMouseLeave ? onMouseLeave : undefined}
            onError={(e) => {
                if (e.currentTarget.src === INVALID_ASSET_PATH) return
                SET_ASSET_PROPS(e.currentTarget, fallback || { src: INVALID_ASSET_PATH, alt: 'invalid asset' })
            }}
            className={className}
            style={style}
            id={id}
        />
    )
}

export default GameAsset
