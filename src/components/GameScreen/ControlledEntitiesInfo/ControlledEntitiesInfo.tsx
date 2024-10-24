import { CharacterDisplayInGame } from '@components/CharacterDisplay'
import { selectActiveEntity, selectControlledEntities } from '@redux/slices/gameScreenSlice'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import styles from './ControlledEntitiesInfo.module.css'

const ControlledEntitiesInfo = () => {
    const controlledEntities = useSelector(selectControlledEntities)
    const activeEntity = useSelector(selectActiveEntity)

    const noEntities = useCallback(() => {
        return <p>You have no entities</p>
    }, [])

    return (
        <div className={styles.entitiesContainer}>
            {controlledEntities
                ? controlledEntities.length > 0
                    ? controlledEntities
                          .map((entity, index) => (
                              <CharacterDisplayInGame
                                  character={entity}
                                  className={'flex w-full flex-col gap-4 border-2 p-4'}
                                  key={index}
                              />
                          ))
                          .sort((a, b) => {
                              if (activeEntity) {
                                  const activeEntitySquare = JSON.stringify(activeEntity.square)
                                  if (JSON.stringify(b.props.character?.square) === activeEntitySquare) {
                                      return 1
                                  } else if (JSON.stringify(a.props.character?.square) === activeEntitySquare) {
                                      return -1
                                  }
                                  return a.props.character?.square?.line > b.props.character?.square?.line ? 1 : -1
                              }
                              return a.props.character?.square?.line > b.props.character?.square?.line ? 1 : -1
                          })
                    : noEntities()
                : noEntities()}
        </div>
    )
}

export default ControlledEntitiesInfo
