import { selectControlledEntities } from '@redux/slices/infoSlice'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import styles from './ControlledEntitiesInfo.module.css'
import { CharacterDisplayInGame } from '@components/CharacterDisplay'

const ControlledEntitiesInfo = () => {
    const controlledEntities = useSelector(selectControlledEntities)

    const noEntities = useCallback(() => {
        return <p>You have no entities</p>
    }, [])

    return (
        <div className={styles.entitiesContainer}>
            {controlledEntities
                ? controlledEntities.length > 0
                    ? controlledEntities.map((entity, index) => (
                          <div key={index}>
                              <CharacterDisplayInGame character={entity} className={'flex w-full flex-col gap-4 border-2 p-4'} />
                          </div>
                      ))
                    : noEntities()
                : noEntities()}
        </div>
    )
}

export default ControlledEntitiesInfo
