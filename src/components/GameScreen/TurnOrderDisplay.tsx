import { CharacterGameAsset } from '@components/GameAsset'
import { Button } from '@components/ui/button'
import { CharacterInTurnOrder } from '@models/GameHandshake'
import { selectActiveEntity, selectTurnOrder } from '@redux/slices/gameScreenSlice'
import { cn, getCharacterSide } from '@utils'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@redux/store'
import { useBattlefieldContext } from '@context/BattlefieldContext'

const CharacterCard = ({ character, isActive = false }: { character: CharacterInTurnOrder; isActive?: boolean }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const { t } = useTranslation()

    return (
        <div
            className={cn(
                'flex h-12 w-full flex-row gap-1 transition-all',
                isActive || isHovered ? 'opacity-100' : 'opacity-70 grayscale'
            )}
            style={{
                transform: `translateX(-${isActive ? 0 : 10}%)`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={t(character.decorations.name)}
        >
            <CharacterGameAsset
                src={character.decorations.sprite}
                alt={character.descriptor}
                className={cn('h-full w-4/5 overflow-y-hidden object-cover')}
                line={character.square.line}
            />
            <div
                className={cn(
                    'relative flex h-full w-1/5 items-center justify-center overflow-hidden rounded opacity-90',
                    getCharacterSide(character.square.line) === 'ally'
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

const TurnOrderDisplay = () => {
    const turnOrder = useSelector(selectTurnOrder)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [hasOverflow, setHasOverflow] = useState(false)
    // const activeCharacter = useSelector(selectActiveEntity)
    // const { setActiveSquares, resetActiveSquares } = useBattlefieldContext()

    // useEffect(() => {
    //     resetActiveSquares()
    //     if (activeCharacter === null) {
    //         return
    //     } else {
    //         setActiveSquares(`${activeCharacter.square.line}/${activeCharacter.square.column}`)
    //     }
    // }, [activeCharacter])

    useEffect(() => {
        const checkForOverflow = () => {
            if (scrollContainerRef.current) {
                setHasOverflow(scrollContainerRef.current.scrollHeight > scrollContainerRef.current.clientHeight)
            }
        }
        setTimeout(checkForOverflow)
        window.addEventListener('resize', checkForOverflow)
        return () => window.removeEventListener('resize', checkForOverflow)
    }, [])

    const scrollUp = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ top: -400, behavior: 'smooth' })
        }
    }

    const scrollDown = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ top: 400, behavior: 'smooth' })
        }
    }

    return (
        <div
            className={
                'no-visible-scrollbar relative flex h-[50rem] w-40 flex-col gap-4 overflow-y-scroll rounded border-2 p-2'
            }
            ref={scrollContainerRef}
        >
            {hasOverflow && (
                <Button className={'sticky top-2 z-10 w-full border-2 opacity-100'} onClick={scrollUp}>
                    <IoIosArrowUp />
                </Button>
            )}
            {turnOrder.order.map((character, index) => (
                <CharacterCard character={character} key={index} isActive={index === turnOrder.current} />
            ))}
            {hasOverflow && (
                <Button className={'sticky bottom-2 w-full border-2'} onClick={scrollDown}>
                    <IoIosArrowDown />
                </Button>
            )}
        </div>
    )
}

export default TurnOrderDisplay
