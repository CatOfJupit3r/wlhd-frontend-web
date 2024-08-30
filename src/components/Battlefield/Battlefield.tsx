import {
    ConnectorTile,
    FifthColumnTile,
    FirstColumnTile,
    FourthColumnTile,
    MeleeLineTile,
    RangedLineTile,
    SafeLineTile,
    SecondColumnTile,
    SeparatorTile,
    SixthColumnTile,
    ThirdColumnTile,
} from '@components/Battlefield/Tiles/CosmeticTiles'
import TileEntity from '@components/Battlefield/Tiles/TileEntity'
import { useCallback } from 'react'
import styles from './Battlefield.module.css'
import { cn } from '@utils'

// const BATTLEFIELD_BLUR_HASH: string =
//     '{7H2i;WB00j[9Ft7M{ofofazoLayoLayfQay00WB-;j[%gt7xuofoffQWBj[WBj[WBj[00WB~qfQ?cof%MfQt7j[ayj[ayfQayj[MxayofayoffQofayayj[t7ayt7WBofWBWBay%MfQxuj[t7j['

const Battlefield = () => {
    const SeparatorRow = useCallback(() => {
        return (
            <div id={'separator-row'} className={'flex'}>
                <ConnectorTile />
                <SeparatorTile />
                <SeparatorTile />
                <SeparatorTile />
                <SeparatorTile />
                <SeparatorTile />
                <SeparatorTile />
                <ConnectorTile />
            </div>
        )
    }, [])

    const NavigationHelpRow = useCallback(() => {
        return (
            <div id={'nav-help-row'} className={'flex'}>
                <ConnectorTile />
                <FirstColumnTile />
                <SecondColumnTile />
                <ThirdColumnTile />
                <FourthColumnTile />
                <FifthColumnTile />
                <SixthColumnTile />
                <ConnectorTile />
            </div>
        )
    }, [])

    const CharactersOnRow = useCallback(({ line }: { line: string }) => {
        return (
            <>
                <TileEntity square={`${line}/1`} />
                <TileEntity square={`${line}/2`} />
                <TileEntity square={`${line}/3`} />
                <TileEntity square={`${line}/4`} />
                <TileEntity square={`${line}/5`} />
                <TileEntity square={`${line}/6`} />
            </>
        )
    }, [])

    return (
        <div className={cn(styles.battlefield, 'flex flex-col')} id={'battlefield-div'}>
            <NavigationHelpRow />
            <div id={'safe-enemy'} className={'flex'}>
                <SafeLineTile />
                <CharactersOnRow line={'1'} />
                <SafeLineTile />
            </div>
            <div id={'ranged-enemy'} className={'flex'}>
                <RangedLineTile />
                <CharactersOnRow line={'2'} />
                <RangedLineTile />
            </div>
            <div id={'melee-enemy'} className={'flex'}>
                <MeleeLineTile />
                <CharactersOnRow line={'3'} />
                <MeleeLineTile />
            </div>
            <SeparatorRow />
            <div id={'melee-ally'} className={'flex'}>
                <MeleeLineTile />
                <CharactersOnRow line={'4'} />
                <MeleeLineTile />
            </div>
            <div id={'ranged-ally'} className={'flex'}>
                <RangedLineTile />
                <CharactersOnRow line={'5'} />
                <RangedLineTile />
            </div>
            <div id={'safe-ally'} className={'flex'}>
                <SafeLineTile />
                <CharactersOnRow line={'6'} />
                <SafeLineTile />
            </div>
            <NavigationHelpRow />
        </div>
    )
}

export default Battlefield
