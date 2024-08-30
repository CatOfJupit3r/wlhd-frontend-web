import GameAsset from '@components/GameAsset'
import { ImgHTMLAttributes, useMemo, useState } from 'react'
import Decoration from './Decoration/Decoration'
import EntityTooltip from './EntityTooltip/EntityTooltip'
import styles from './Tiles.module.css'

import { useBattlefieldContext } from '@context/BattlefieldContext'
import { cn, getCharacterSide } from '@utils'
import { generateAssetPath } from '@utils/generateAssetPath'
import { useTranslation } from 'react-i18next'

const TileEntity = ({ square, className, ...props }: { square: string } & ImgHTMLAttributes<HTMLImageElement>) => {
    const { battlefield, onClickTile } = useBattlefieldContext()
    const { t } = useTranslation()
    const fallback = useMemo(() => {
        const line = square.split('/')[0]
        const side = getCharacterSide(line)
        return {
            src: generateAssetPath('builtins', side ?? 'enemy'),
            alt: `Unknown ${side}`,
        }
    }, [square])

    const squareInfo = useMemo(() => battlefield[square], [battlefield, square])

    const [showTooltip, setShowTooltip] = useState(false)

    const handleMouseEnter = () => {
        setShowTooltip(true)
    }

    const handleMouseLeave = () => {
        setShowTooltip(false)
    }

    return (
        <div
            className={cn(
                'relative',
                squareInfo?.info !== null ? 'bg-cover' : '',
                squareInfo?.flags.interactable ? 'cursor-pointer' : 'cursor-default',
                'h-[10vh] w-[10vh]'
            )}
            onDoubleClick={() => {
                if (squareInfo?.flags.interactable) {
                    onClickTile(square)
                }
            }}
            id={`square_${square}`}
            style={{
                backgroundImage: `url(/assets/local/default_battlefield/tile.png)`,
            }}
        >
            <Decoration square={square} />
            {squareInfo?.info.character?.decorations.sprite ? (
                <GameAsset
                    {...props}
                    src={squareInfo?.info.character?.decorations.sprite}
                    alt={t(squareInfo?.info.character?.decorations.name)}
                    fallback={fallback}
                    className={cn(styles.tile, className)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
            ) : null}
            {showTooltip &&
                (squareInfo?.info.character ? <EntityTooltip character={squareInfo?.info.character} /> : null)}
        </div>
    )
}

export default TileEntity
