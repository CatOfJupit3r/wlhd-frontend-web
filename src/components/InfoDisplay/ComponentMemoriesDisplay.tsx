import { GameComponentMemory, PossibleMemory } from '@models/GameModels'
import { capitalizeFirstLetter } from '@utils'
import React, { FC, HTMLAttributes, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const ComponentMemory: React.FC<
    {
        memory: PossibleMemory
    } & HTMLAttributes<HTMLLIElement>
> = ({ memory, ...props }) => {
    const { t } = useTranslation()
    const { type, value, display_name, display_value, internal } = memory

    const DisplayedValue = useCallback(() => {
        let displayed = ''

        if (!value && !display_value) {
            displayed = '-'
        } else {
            if (display_value) {
                displayed = t(display_value)
            } else {
                switch (type) {
                    case 'dice':
                        if (typeof value == 'object' && value && 'amount' in value && 'sides' in value) {
                            displayed = t('local:game.info-display.memories.dice', {
                                amount: value.amount,
                                sides: value.sides,
                            })
                        }
                        break
                    default:
                        displayed = JSON.stringify(value)
                        break
                }
            }
        }

        return <p className={internal ? 'text-gray-400' : ''}>{displayed}</p>
    }, [memory])

    return (
        <li className={'flex flex-row gap-1'} {...props}>
            <p>{capitalizeFirstLetter(t(display_name))}</p> : <DisplayedValue />
        </li>
    )
}

const ComponentMemories: FC<{ memories: GameComponentMemory | null }> = ({ memories }) => {
    if (!memories || Object.keys(memories).length === 0) {
        return null
    }
    return (
        <div id={'method-variables'} className={'mt-2 flex flex-col items-center gap-1 px-8 text-t-small'}>
            <ul>
                {Object.entries(memories)
                    .filter(([_, memory]) => !memory.internal)
                    .map(([_, memory], index) => {
                        return <ComponentMemory key={index} memory={memory} />
                    })}
            </ul>
        </div>
    )
}

export default ComponentMemories
