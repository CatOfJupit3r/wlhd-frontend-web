import { REACT_APP_BACKEND_URL } from 'config'
import TileCosmetic from './Tiles/TileCosmetic'
import TileEntity from './Tiles/TileEntity'
import { splitDescriptor } from '@utils'

export const generateAssetPath = (dlc: string, descriptor: string) => {
    return `${REACT_APP_BACKEND_URL}/assets/${dlc}/${descriptor}`
}

export const generateAssetPathFullDescriptor = (full_descriptor: string) => {
    const [dlc, descriptor] = splitDescriptor(full_descriptor)
    return generateAssetPath(dlc, descriptor)
}

export const CONNECTORS = (descriptor: string, key: string) => {
    return <TileCosmetic full_descriptor={descriptor} id={'connector_' + key} key={key} />
}

export const SEPARATORS = (descriptor: string, key: string) => {
    return <TileCosmetic full_descriptor={descriptor} id={'separator_' + key} key={key} />
}

export const COLUMN = (descriptor: string, key: string) => {
    return <TileCosmetic full_descriptor={descriptor} id={'column_' + key} key={key} />
}

export const COLUMNS_ARRAY = (columns: string[]) => {
    return columns.map((descriptor, index) => COLUMN(descriptor, index.toString()))
}

export const LINE = (descriptor: string, key: string) => {
    return <TileCosmetic full_descriptor={descriptor} id={'line_' + key} key={key} />
}

export const LINES_ARRAY = (lines: string[], key: string) => {
    return lines.map((descriptor, index) => LINE(descriptor, `${index.toString()}_${key}`))
}

export const JSX_BATTLEFIELD = (battlefield: string[][], field_components: { [key: string]: string }) => {
    const battlefieldJSX: JSX.Element[][] = Array<Array<JSX.Element>>()
    for (let i = 0; i < battlefield.length; i++) {
        const row = []
        for (let j = 0; j < battlefield[i].length; j++) {
            const alias = battlefield[i][j]
            const full_descriptor = field_components[alias]
            const tile_id = `${i + 1}/${j + 1}`
            const isAlly = i + 1 > Math.floor(battlefield.length / 2)
            row.push(
                <TileEntity
                    full_descriptor={full_descriptor}
                    id={tile_id}
                    key={tile_id}
                    fallback={{
                        src: isAlly ? generateAssetPath('builtins', 'ally') : generateAssetPath('builtins', 'enemy'),
                        alt: isAlly ? 'ally' : 'enemy',
                    }}
                />
            )
        }
        battlefieldJSX.push(row)
    }
    return battlefieldJSX
}
