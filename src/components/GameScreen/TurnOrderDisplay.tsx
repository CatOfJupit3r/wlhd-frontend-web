import BetterScrollableContainer from '@components/BetterScrollableContainer'
import { CharacterGameAsset } from '@components/GameAsset'
import { CharacterInTurnOrder } from '@models/GameModels'
import { selectTurnOrder } from '@redux/slices/gameScreenSlice'
import { cn, getCharacterSide } from '@utils'
import React, { forwardRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const CharacterCard = forwardRef(
    (
        {
            character,
            isActive = false,
            onMouseEnter,
            onMouseLeave,
            className,
            ...props
        }: {
            character: CharacterInTurnOrder
            isActive?: boolean
        } & React.HTMLAttributes<HTMLDivElement>,
        ref: React.Ref<HTMLDivElement>
    ) => {
        const [isHovered, setIsHovered] = useState<boolean>(false)
        const { t } = useTranslation()

        return (
            <div
                className={cn(
                    'flex h-12 w-full flex-row gap-1 transition-all',
                    isActive || isHovered ? 'opacity-100' : 'opacity-70 grayscale',
                    className
                )}
                style={{
                    transform: `translateX(-${isActive ? 0 : 10}%)`,
                }}
                onMouseEnter={(e) => {
                    setIsHovered(true)
                    if (onMouseEnter) {
                        onMouseEnter(e)
                    }
                }}
                onMouseLeave={(e) => {
                    setIsHovered(false)
                    if (onMouseLeave) {
                        onMouseLeave(e)
                    }
                }}
                title={t(character.decorations.name)}
                ref={ref}
                {...props}
            >
                <CharacterGameAsset
                    src={character.decorations.sprite}
                    alt={character.descriptor}
                    className={cn('h-full w-4/5 overflow-y-hidden object-cover')}
                    line={character.square?.line ?? 4}
                />
                <div
                    className={cn(
                        'relative flex h-full w-1/5 items-center justify-center overflow-hidden rounded opacity-90',
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
            </div>
        )
    }
)

const TurnOrderDisplay = () => {
    const turnOrder = useSelector(selectTurnOrder)

    return (
        <BetterScrollableContainer>
            {turnOrder.map((character, index) =>
                character !== null ? <CharacterCard character={character} key={index} isActive={index === 0} /> : null
            )}
        </BetterScrollableContainer>
    )
}

export { CharacterCard }
export default TurnOrderDisplay
