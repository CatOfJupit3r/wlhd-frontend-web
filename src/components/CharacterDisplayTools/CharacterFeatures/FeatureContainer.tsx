import { FC, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchCharacterAttributes,
    fetchCharacterInventory,
    fetchCharacterSpellbook,
    fetchCharacterStatusEffects,
    fetchCharacterWeaponry, resetCharacterFeatures,
    selectAttributes,
    selectDescriptor,
    selectInventory, selectLoading,
    selectSpells,
    selectStatusEffects,
    selectWeaponry,
} from '../../../redux/slices/characterSlice'
import { selectLobbyId } from '../../../redux/slices/lobbySlice'
import AttributeDisplay from '../../EntityDisplay/AttributeDisplay/AttributeDisplay'
import InfoDisplay from '../../EntityDisplay/InfoDisplay/InfoDisplay'
import { AppDispatch } from '../../../redux/store'

interface ItemContainerProps {
    type: 'inventory'
}

interface WeaponContainerProps {
    type: 'weaponry'
}

interface SpellContainerProps {
    type: 'spells'
}

interface AttributeContainerProps {
    type: 'attributes'
}

interface StatusEffectContainerProps {
    type: 'statusEffects'
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
    const dispatch = useDispatch<AppDispatch>()
    const loading = useSelector(selectLoading)

    const [descriptorChanged, setDescriptorChanged] = useState(false)

    useEffect(() => {
        if (!descriptor) {
            return
        }
        dispatch(resetCharacterFeatures())
        setDescriptorChanged(true)
    }, [descriptor])

    useEffect(() => {
        if (!descriptor) {
            return
        }
        if ((!descriptorChanged && ['pending', 'fulfilled', 'rejected'].includes(loading[type]))) {
            return
        }
        switch (type) {
            case 'inventory':
                dispatch(fetchCharacterInventory(lobbyId))
                break
            case 'weaponry':
                dispatch(fetchCharacterWeaponry(lobbyId))
                break
            case 'spells':
                dispatch(fetchCharacterSpellbook(lobbyId))
                break
            case 'statusEffects':
                dispatch(fetchCharacterStatusEffects(lobbyId))
                break
            case 'attributes':
                dispatch(fetchCharacterAttributes(lobbyId))
                break
            default:
                break
        }
        setDescriptorChanged(false)
    }, [descriptorChanged, lobbyId, type])

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
                    return (
                        <InfoDisplay
                            type={'spell'}
                            info={{
                                ...value,
                                isActive: spellLayout.layout.includes(value.descriptor),
                            }}
                            key={index}
                        />
                    )
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
                <AttributeDisplay attributes={inventory} />
            </>
        ) : (
            <Loading />
        )
    }, [descriptor])

    const ProvidedContent = useCallback(() => {
        switch (type) {
            case 'inventory': {
                return <Inventory />
            }
            case 'spells': {
                return <SpellBook />
            }
            case 'weaponry': {
                return <Weaponry />
            }
            case 'attributes': {
                return <Attributes />
            }
            case 'statusEffects': {
                return <StatusEffects />
            }
            default: {
                return <Loading />
            }
        }
    }, [type])

    return (
        <div id={`${type}-container`} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        }}>
            <ProvidedContent />
        </div>
    )
}

export default FeatureContainer
