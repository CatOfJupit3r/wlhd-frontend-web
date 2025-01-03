import BetterScrollableContainer from '@components/BetterScrollableContainer'
import { CharacterGameAsset } from '@components/GameAsset'
import { CharacterInTurnOrder } from '@models/GameModels'
import { selectTurnOrder } from '@redux/slices/gameScreenSlice'
import { cn, getCharacterSide } from '@utils'
import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import { forwardRef, Ref, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface iCharacterCard extends MotionProps {
    character: CharacterInTurnOrder
    isActive?: boolean
    className?: string
    onDoubleClick?: () => void
}

const CharacterCard = forwardRef(
    ({ character, isActive = false, className, ...props }: iCharacterCard, ref: Ref<HTMLDivElement>) => {
        const { t } = useTranslation()
        return (
            <motion.div
                className={cn(
                    'flex h-10 w-full flex-row items-center gap-1 overflow-y-hidden hover:opacity-100 hover:grayscale-0',
                    isActive ? 'opacity-100' : 'opacity-70 grayscale',
                    className
                )}
                style={{
                    transitionDuration: '150ms',
                    transitionProperty: 'filter',
                }}
                title={t(character.decorations.name)}
                ref={ref}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: isActive ? 0 : -5, opacity: 1 }} // active characters are a bit to the right
                exit={{ x: -100, opacity: 0 }}
                layout
                transition={{
                    layout: {
                        type: 'tween',
                        damping: 25,
                        stiffness: 200,
                    },
                }}
                {...props}
            >
                <CharacterGameAsset
                    src={character.decorations.sprite}
                    alt={character.descriptor}
                    className={cn('h-20 w-28 overflow-y-hidden object-cover')}
                    line={character.square?.line ?? 4}
                />
                <div
                    className={cn(
                        'relative flex h-full w-3 items-center justify-center overflow-hidden rounded opacity-90',
                        getCharacterSide(character.square?.line ?? 4) === 'ally'
                            ? isActive
                                ? character.controlledByYou
                                    ? 'bg-blue-800'
                                    : 'bg-indigo-600'
                                : character.controlledByYou
                                  ? 'bg-blue-400'
                                  : 'bg-indigo-300'
                            : isActive
                              ? character.controlledByYou
                                  ? 'bg-red-600'
                                  : 'bg-rose-700'
                              : character.controlledByYou
                                ? 'bg-red-400'
                                : 'bg-rose-400'
                    )}
                ></div>
            </motion.div>
        )
    }
)

type InnerInterOrderItem = {
    character: CharacterInTurnOrder
    isActive: boolean
    key: string
}

const TurnOrderDisplay = () => {
    const turnOrder = useSelector(selectTurnOrder)
    const [innerTurnOrder, setInnerTurnOrder] = useState<InnerInterOrderItem[]>([])

    useEffect(() => {
        // ask your god to explain this code
        const endOfTurn = turnOrder.findIndex((character) => character === null)
        const firstHalf = turnOrder
            .slice(0, endOfTurn)
            .filter((character) => character !== null)
            .map((character, index) => ({
                character,
                isActive: index === 0,
                key: character?.descriptor, // tsc --noEmit thinks that this can be null ignoring the filter above
            }))
        const secondHalf = turnOrder
            .slice(endOfTurn + 1)
            .filter((character) => character !== null)
            .map((character) => ({
                character,
                isActive: false,
            }))
        const found = new Map<string, number>()

        const newInnerTurnOrder = [...secondHalf, ...firstHalf].map(({ character, ...rest }) => {
            // tsc --noEmit
            const howManyFound = found.get(character?.descriptor ?? '') ?? 0
            // tsc --noEmit
            found.set(character?.descriptor ?? '', howManyFound + 1)
            return {
                ...rest,
                character,
                key: `${character?.descriptor}-${howManyFound}`,
            }
        })
        const howManyAfterEnd = secondHalf.length
        let i = 0
        const newInnerTurnOrderProcessed = [...newInnerTurnOrder]
        while (i < howManyAfterEnd) {
            const shifted = newInnerTurnOrderProcessed.shift()
            if (shifted) {
                newInnerTurnOrderProcessed.push(shifted)
            }
            i++
        }
        setInnerTurnOrder(newInnerTurnOrderProcessed as InnerInterOrderItem[])
    }, [turnOrder])

    return (
        <BetterScrollableContainer className={'w-20'}>
            <AnimatePresence>
                {innerTurnOrder
                    .filter((character) => character !== null)
                    .map(({ key, character, isActive }) => (
                        <CharacterCard key={key} character={character} isActive={isActive} />
                    ))}
            </AnimatePresence>
        </BetterScrollableContainer>
    )
}

export { CharacterCard }
export default TurnOrderDisplay
