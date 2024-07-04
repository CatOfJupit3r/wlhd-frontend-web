import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <h1>By player, for players... and developers too!</h1>
            <div id={'footer-links'} className={styles.linksContainer}>
                <Link to={'/'}>Home</Link>
                <Link to={'/about'}>About</Link>
                <Link to={'/contact'}>Contact</Link>
            </div>
        </footer>
    )
}

export default Footer
