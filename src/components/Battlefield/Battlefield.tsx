import { useCallback } from 'react'
import { Blurhash } from 'react-blurhash'
import { useSelector } from 'react-redux'
import { BATTLEFIELD_BLUR_HASH } from 'config'
import {
    selectBattlefieldMold,
    selectColumns,
    selectConnectors,
    selectFieldComponents,
    selectLines,
    selectSeparators,
} from '@redux/slices/battlefieldSlice'
import styles from './Battlefield.module.css'
import { COLUMNS_ARRAY, CONNECTORS, JSX_BATTLEFIELD, LINES_ARRAY, SEPARATORS } from './utils'

const Battlefield = () => {
    const connectors = useSelector(selectConnectors)
    const columns = useSelector(selectColumns)
    const lines = useSelector(selectLines)
    const separators = useSelector(selectSeparators)
    const field_components = useSelector(selectFieldComponents)
    const battlefield = useSelector(selectBattlefieldMold)

    const numberOfRows = battlefield.lines.length
    const allyRowIndexes = Array.from({ length: Math.floor(numberOfRows / 2) }, (_, i) => i)
    const enemyRows = Array.from({ length: Math.floor(numberOfRows / 2) }, (_, i) => i + Math.floor(numberOfRows / 2))

    const columnHelpRow = useCallback(
        (key: string) => {
            const rendered = []
            rendered.push(
                <div
                    key={`column-help-${key}`}
                    style={{
                        display: 'flex',
                    }}
                >
                    {CONNECTORS(connectors, key)}
                    {COLUMNS_ARRAY(columns)}
                    {CONNECTORS(connectors, key + 1)}
                </div>
            )
            return rendered
        },
        [connectors, columns]
    )

    const displayRows = useCallback(
        (rows: number[], side_type: string) => {
            const rendered = []
            const right_lines = LINES_ARRAY(lines, `${side_type}_right`)
            const left_lines = LINES_ARRAY(lines, `${side_type}_left`)
            const battlefieldJSX = JSX_BATTLEFIELD(battlefield.field, field_components)
            for (const i of rows) {
                rendered.push(
                    <div
                        style={{
                            display: 'flex',
                        }}
                        key={`entity-row-${i}`}
                    >
                        {right_lines[i]}
                        {battlefieldJSX[i]}
                        {left_lines[i]}
                    </div>
                )
            }
            return rendered
        },
        [battlefield.field, field_components, lines]
    )

    const displaySeparators = useCallback(() => {
        const rendered = []
        rendered.push(
            <div
                style={{
                    display: 'flex',
                }}
                key={'separator-row'}
            >
                {CONNECTORS(connectors, '1')}
                {[...Array(columns.length)].map((_, index) => SEPARATORS(separators, index.toString()))}
                {CONNECTORS(connectors, '2')}
            </div>
        )
        return rendered
    }, [columns, connectors, separators])

    return (
        <div className={styles.battlefield} id={'battlefield-div'}>
            {!battlefield ? (
                <Blurhash
                    hash={BATTLEFIELD_BLUR_HASH}
                    width={'80vh'}
                    height={'90vh'}
                    style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                    }}
                />
            ) : (
                <>
                    {columnHelpRow('1')}
                    {displayRows(allyRowIndexes, 'ally')}
                    {displaySeparators()}
                    {displayRows(enemyRows, 'enemy')}
                    {columnHelpRow('2')}
                </>
            )}
        </div>
    )
}

export default Battlefield
