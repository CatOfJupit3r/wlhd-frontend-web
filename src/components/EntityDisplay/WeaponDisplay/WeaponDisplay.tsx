import { useTranslation } from 'react-i18next'
import { WeaponInfo } from '../../../models/Battlefield'
import ElementWithIcon from '../../ElementWithIcon/ElementWithIcon'
import styles from '../EntityDisplay.module.css'

const WeaponDisplay = ({ weapon }: { weapon: WeaponInfo }) => {
    const { t } = useTranslation()

    const { decorations, cost, uses, consumable, quantity, cooldown, isActive, user_needs_range } = weapon

    return (
        <div className={styles.infoSegmentContainer}>
            <div id={'main-info'} className={styles.infoSegmentHeading}>
                <div
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    {t(decorations.name)}
                    {isActive && (
                        <img
                            src={'/assets/local/available_icon.svg'}
                            style={{
                                width: '1.25rem',
                                height: '1.25rem',
                            }}
                            alt={'available'}
                        />
                    )}
                </div>
                <ElementWithIcon
                    icon={
                        <img
                            src={'/assets/local/cooldown.png'}
                            style={{
                                width: '1.25rem',
                                height: '1.25rem',
                            }}
                            alt={'cooldown'}
                        />
                    }
                    element={
                        <p
                            style={{
                                margin: '0',
                                fontSize: '1rem',
                                color: 'white',
                            }}
                        >
                            {cooldown.current}/{cooldown.max}
                        </p>
                    }
                />
            </div>
            <div id={'minor-info'} className={styles.infoSegmentMinorInfo}>
                <div id={'type-details'} className={styles.infoSegmentTypeDetails}>
                    {consumable ? <p>{t('Consumable')}</p> : <p>{t('Not Consumable')}</p>}
                    <p>{`${t('Count')}: ${quantity}`}</p>
                    <p>{`${t('Cost')}: ${cost}`}</p>
                </div>
                <div id={'usages'} className={styles.infoSegmentUsageDetails}>
                    <p>
                        User must be on:{' '}
                        {user_needs_range
                            ? user_needs_range
                                  .map((value: unknown) => {
                                      if (value && !(value instanceof String)) {
                                          return value
                                      }
                                  })
                                  .join(',')
                            : '???'}
                    </p>
                    {uses && uses.max !== null && <p>{`${t('Uses')}: ${uses.current || '0'}|${uses.max || '0'}`}</p>}
                </div>
            </div>
            <div id={'description'} className={styles.infoSegmentDescription}>
                {t(decorations.description)}
            </div>
        </div>
    )
}

export default WeaponDisplay
