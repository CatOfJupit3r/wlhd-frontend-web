import { CharacterGameAsset } from '@components/GameAsset'
import { ImgHTMLAttributes, useMemo } from 'react'
import Decoration from './Decoration/Decoration'
import EntityTooltip from './EntityTooltip/EntityTooltip'
import styles from './Tiles.module.css'

import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { useBattlefieldContext } from '@context/BattlefieldContext'
import { cn } from '@utils'
import { useTranslation } from 'react-i18next'

const TileEntity = ({ square, className, ...props }: { square: string } & ImgHTMLAttributes<HTMLImageElement>) => {
    const { battlefield, onClickTile, createBonusTileTooltip } = useBattlefieldContext()
    const { t } = useTranslation()
    const bonusTooltip = useMemo(() => createBonusTileTooltip(square), [createBonusTileTooltip, square])
    const line = useMemo(() => parseInt(square.split('/')[0] ?? '1'), [square])

    const squareInfo = useMemo(() => battlefield[square], [battlefield, square])

    return (
        <Tooltip>
            <TooltipTrigger
                className={squareInfo?.flags.interactable?.flag ? 'cursor-pointer' : 'cursor-default'}
                asChild={true}
            >
                <div
                    className={cn(
                        'relative',
                        squareInfo?.info !== null ? 'bg-cover' : '',
                        'h-[var(--tile-size)] w-[var(--tile-size)]'
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
                        <CharacterGameAsset
                            {...props}
                            line={line}
                            src={squareInfo?.info.character?.decorations.sprite}
                            alt={t(squareInfo?.info.character?.decorations.name)}
                            className={cn(styles.tile, className)}
                        />
                    ) : null}
                </div>
            </TooltipTrigger>
            <TooltipContent
                className={cn(
                    'flex flex-wrap border-none bg-gray-800 p-2.5 text-white',
                    'flex-col gap-2 text-ellipsis whitespace-nowrap',
                    'opacity-95',
                    squareInfo?.info.character ? 'w-96' : 'w-60',
                    !squareInfo?.info.character && !bonusTooltip ? 'hidden' : null
                )}
                side={squareInfo?.info.character ? 'right' : 'top'}
            >
                {squareInfo?.info.character ? <EntityTooltip character={squareInfo?.info.character} /> : null}
                {bonusTooltip ? <div className={'w-54 flex flex-row gap-1'}>{bonusTooltip}</div> : null}
            </TooltipContent>
        </Tooltip>
    )
}

export default TileEntity
