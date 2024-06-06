import { FC, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
    fetchCharacterAttributes,
    fetchCharacterInventory,
    fetchCharacterSpellbook,
    fetchCharacterStatusEffects,
    fetchCharacterWeaponry,
    selectAttributes,
    selectDescriptor,
    selectInventory,
    selectSpells,
    selectStatusEffects,
    selectWeaponry,
} from '../../../redux/slices/characterSlice'
import { selectLobbyId } from '../../../redux/slices/lobbySlice'
import AttributeDisplay from '../../EntityDisplay/AttributeDisplay/AttributeDisplay'
import InfoDisplay from '../../EntityDisplay/InfoDisplay/InfoDisplay'

interface ItemContainerProps {
    type: 'item'
}

interface WeaponContainerProps {
    type: 'weapon'
}

interface SpellContainerProps {
    type: 'spell'
}

interface AttributeContainerProps {
    type: 'attributes'
}

interface StatusEffectContainerProps {
    type: 'status_effect'
}

type ProvidingProps =
    | ItemContainerProps
    | WeaponContainerProps
    | SpellContainerProps
    | StatusEffectContainerProps
    | AttributeContainerProps
type FeatureProps = ProvidingProps

const FeatureContainer: FC<FeatureProps> = ({ type }) => {
    const descriptor = useSelector(selectDescriptor)
    const lobbyId = useSelector(selectLobbyId)

    useEffect(() => {
        switch (type) {
            case 'item':
                fetchCharacterInventory(lobbyId)
                break
            case 'weapon':
                fetchCharacterWeaponry(lobbyId)
                break
            case 'spell':
                fetchCharacterSpellbook(lobbyId)
                break
            case 'status_effect':
                fetchCharacterStatusEffects(lobbyId)
                break
            case 'attributes':
                fetchCharacterAttributes(lobbyId)
                break
            default:
                break
        }
    }, [descriptor, lobbyId])

    const Loading = useCallback(() => {
        return <div>Loading...</div>
    }, [])

    const Inventory = useCallback(() => {
        const [inventory, isLoaded] = useSelector(selectInventory)

        return isLoaded === 'fulfilled' && inventory ? (
            <>
                {inventory.map((value, index) => {
                    return <InfoDisplay type={'item'} info={value} key={index} />
                })}
            </>
        ) : (
            <Loading />
        )
    }, [descriptor])

    const StatusEffects = useCallback(() => {
        const [effects, isLoaded] = useSelector(selectStatusEffects)

        return isLoaded === 'fulfilled' && effects ? (
            <>
                {effects.map((value, index) => {
                    return <InfoDisplay type={'status_effect'} info={value} key={index} />
                })}
            </>
        ) : (
            <Loading />
        )
    }, [descriptor])

    const Weaponry = useCallback(() => {
        const [weaponry, isLoaded] = useSelector(selectWeaponry)

        return isLoaded === 'fulfilled' && weaponry ? (
            <>
                {weaponry.map((value, index) => {
                    return <InfoDisplay type={'weapon'} info={value} key={index} />
                })}
            </>
        ) : (
            <Loading />
        )
    }, [descriptor])

    const SpellBook = useCallback(() => {
        const [{ spellBook, spellLayout }, isLoaded] = useSelector(selectSpells)

        return isLoaded === 'fulfilled' && spellBook ? (
            <>
                {spellBook.map((value, index) => {
                    return <InfoDisplay type={'spell'} info={value} key={index} />
                })}
            </>
        ) : (
            <Loading />
        )
    }, [descriptor])

    const Attributes = useCallback(() => {
        const [inventory, isLoaded] = useSelector(selectAttributes)

        return isLoaded === 'fulfilled' ? (
            <>
                return <AttributeDisplay attributes={inventory} />
            </>
        ) : (
            <Loading />
        )
    }, [descriptor])

    const ProvidedContent = useCallback(() => {
        switch (type) {
            case 'item': {
                return <Inventory />
            }
            case 'spell': {
                return <SpellBook />
            }
            case 'weapon': {
                return <Weaponry />
            }
            case 'attributes': {
                return <Attributes />
            }
            case 'status_effect': {
                return <StatusEffects />
            }
            default: {
                return <Loading />
            }
        }
    }, [type])

    return (
        <div id={`${type}-container`}>
            <ProvidedContent />
        </div>
    )
}

export default FeatureContainer
