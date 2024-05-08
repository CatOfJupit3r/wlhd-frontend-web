import { useTranslation } from 'react-i18next'
import { WeaponInfo } from '../../../models/Battlefield'
import ElementWithIcon from '../../ElementWithIcon/ElementWithIcon'
import styles from '../EntityDisplay.module.css'

const WeaponDisplay = ({ weapon }: { weapon: WeaponInfo }) => {
    const { t } = useTranslation()

    const { descriptor, cost, uses, consumable, count, cooldown, isActive } = weapon

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
                    {t(`${descriptor}.name`)}
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
                <div id={"type-details"} className={styles.infoSegmentTypeDetails}>
                    {
                        consumable ? (
                            <p>
                                {t('Consumable')}
                            </p>
                        ) : (
                            <p>
                                {t('Not Consumable')}
                            </p>
                        )
                    }
                    <p>
                        {`${t('Count')}: ${count}`}
                    </p>
                    <p>
                        {`${t('Cost')}: ${cost}`}
                    </p>
                </div>
                <div id={"usages"} className={styles.infoSegmentUsageDetails}>
                    <p>
                        Can be used on:
                    </p>
                    <p>
                        User must be on:
                    </p>
                    <p>
                        {`${t('Uses')}: ${uses || 0}`}
                    </p>
                </div>
            </div>
            <div id={'description'} className={styles.infoSegmentDescription}>
                {t(`${descriptor}.desc`)}
            </div>
        </div>
    )
}

export default WeaponDisplay
