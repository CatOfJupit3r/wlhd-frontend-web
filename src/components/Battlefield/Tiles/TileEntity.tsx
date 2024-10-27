import GameAsset from '@components/GameAsset'
import { ImgHTMLAttributes, useMemo } from 'react'
import Decoration from './Decoration/Decoration'
import EntityTooltip from './EntityTooltip/EntityTooltip'
import styles from './Tiles.module.css'

import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
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

    return (
        <Tooltip>
            <TooltipTrigger className={squareInfo?.flags.interactable?.flag ? 'cursor-pointer' : 'cursor-default'} asChild={true}> 
                <div
                    className={cn('relative', squareInfo?.info !== null ? 'bg-cover' : '', 'h-[10vh] w-[10vh]')}
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
                        />
                    ) : null}
                </div>
            </TooltipTrigger>
            <TooltipContent
                className={cn(`border-none bg-transparent p-0`, squareInfo?.info.character ? null : 'hidden')}
                side={'right'}
            >
                {squareInfo?.info.character ? <EntityTooltip character={squareInfo?.info.character} /> : null}
            </TooltipContent>
        </Tooltip>
    )
}

export default TileEntity
