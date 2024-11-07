import { cn } from '@utils'
import { ImgHTMLAttributes } from 'react'

export const tileClassName =
    'transition-colors w-[var(--tile-size)] h-[var(--tile-size)] max-w-[var(--tile-size)] max-h-[var(--tile-size)]'

const TileFactory = (src: string, displayName: string) => {
    const TileComponent = ({ alt, className, ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>) => (
        <img src={src} alt={alt} className={cn(className ? className : '', tileClassName)} {...props} />
    )
    TileComponent.displayName = displayName
    return TileComponent
}
const prefix = '/assets/local/default_battlefield/'

export const ConnectorTile = TileFactory(prefix + 'connector.svg', 'ConnectorTile')
export const SeparatorTile = TileFactory(prefix + 'separator.png', 'SeparatorTile')
export const Tile = TileFactory(prefix + 'tile.png', 'Tile')

export const SafeLineTile = TileFactory(prefix + 'safe_line.png', 'SafeLineTile')
export const RangedLineTile = TileFactory(prefix + 'ranged_line.png', 'RangedLineTile')
export const MeleeLineTile = TileFactory(prefix + 'melee_line.png', 'MeleeLineTile')

export const SixthColumnTile = TileFactory(prefix + 'six.png', 'SixthColumnTile')
export const FifthColumnTile = TileFactory(prefix + 'five.png', 'FifthColumnTile')
export const FourthColumnTile = TileFactory(prefix + 'four.png', 'FourthColumnTile')
export const ThirdColumnTile = TileFactory(prefix + 'three.png', 'ThirdColumnTile')
export const SecondColumnTile = TileFactory(prefix + 'two.png', 'SecondColumnTile')
export const FirstColumnTile = TileFactory(prefix + 'one.png', 'FirstColumnTile')
