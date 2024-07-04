import EntityDisplay from '@components/EntityDisplay/EntityDisplay'
import { selectControlledEntities } from '@redux/slices/infoSlice'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import styles from './ControlledEntitiesInfo.module.css'

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
                              <EntityDisplay entityInfo={entity} />
                          </div>
                      ))
                    : noEntities()
                : noEntities()}
        </div>
    )
}

export default ControlledEntitiesInfo
