import styles from './Decoration.module.css'

export interface DecorationConfig {
    interactable: {
        flag: boolean
        type: 'ally' | 'enemy' | 'neutral'
    } // refers to square if it can be clicked
    selected: {
        flag: boolean // refers to square if it was clicked
        times: number // refers to how many times it was clicked
    } // refers to square if it was clicked
    active: boolean // refers to entity on square
}



const Decoration = ({ decoration }: { decoration: DecorationConfig }) => {
    const { interactable, selected, active } = decoration

    return (
        <div
            className={`${styles.decoration} ${
                interactable.flag
                    ? (() => {
                          switch (interactable.type) {
                              case 'ally':
                                  return styles.interactableAlly
                              case 'enemy':
                                  return styles.interactableEnemy
                              case 'neutral':
                                  return styles.interactable
                              default:
                                  return ''
                          }
                      })()
                    : ''
            } ${selected.flag ? styles.selected : ''} ${active ? styles.active : ''}`}
        />
    )
}

export default Decoration
