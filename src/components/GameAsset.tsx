import React from 'react'
import { generateAssetPath, generateAssetPathFullDescriptor } from '@components/Battlefield/utils'
import { getCharacterSide } from '@utils'

const INVALID_ASSET_PATH: string = '/assets/local/invalid_asset.png'

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

export const CharacterGameAsset = ({ line, fallback, ...props }: GameAssetProps & { line: string }) => {
    return (
        <GameAsset
            {...props}
            fallback={
                line
                    ? getCharacterSide(line) === 'enemy'
                        ? {
                              src: generateAssetPathFullDescriptor('builtins:enemy'),
                              alt: 'Unknown enemy',
                          }
                        : {
                              src: generateAssetPathFullDescriptor('builtins:ally'),
                              alt: 'Unknown ally',
                          }
                    : undefined
            }
        />
    )
}

export default GameAsset
