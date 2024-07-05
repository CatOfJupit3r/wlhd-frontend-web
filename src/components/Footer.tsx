import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className={
            'relative bottom-0 z-10 box-border block min-h-fit w-full justify-center bg-[#252525FF] p-8'
        }>
            <h1 className={'text-center text-t-normal font-bold text-[#d5d5d5]'}>By player, for players... and developers too!</h1>
            <div id={'footer-links'} className={
                'max-[512px]:flex max-[512px]:flex-col max-[512px]:justify-center max-[512px]:items-center max-[512px]:gap-2 ' +
                'mt-[1%] flex justify-center gap-[1%] text-t-small'
            }>
                <Link to={'/'}>Home</Link>
                <Link to={'/about'}>About</Link>
                <Link to={'/contact'}>Contact</Link>
            </div>
        </footer>
    )
}

export default Footer
