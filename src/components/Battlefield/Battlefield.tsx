import SeparatorRowWithTimestamp from '@components/Battlefield/SeparatorRowWithTimestamp';
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
} from '@components/Battlefield/Tiles/CosmeticTiles';
import TileWithCharacter from '@components/Battlefield/Tiles/TileWithCharacter';
import { cn } from '@utils';
import { useCallback } from 'react';
import styles from './Battlefield.module.css';

// const BATTLEFIELD_BLUR_HASH: string =
//     '{7H2i;WB00j[9Ft7M{ofofazoLayoLayfQay00WB-;j[%gt7xuofoffQWBj[WBj[WBj[00WB~qfQ?cof%MfQt7j[ayj[ayfQayj[MxayofayoffQofayayj[t7ayt7WBofWBWBay%MfQxuj[t7j['

const Battlefield = ({ separatorTimestamp }: { separatorTimestamp?: number | null }) => {
    const SeparatorRow = useCallback(() => {
        if (separatorTimestamp) {
            return <SeparatorRowWithTimestamp timestamp={separatorTimestamp} />;
        }
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
        );
    }, [separatorTimestamp]);

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
        );
    }, []);

    const CharactersOnRow = useCallback(({ line }: { line: string }) => {
        return (
            <>
                <TileWithCharacter square={`${line}/1`} />
                <TileWithCharacter square={`${line}/2`} />
                <TileWithCharacter square={`${line}/3`} />
                <TileWithCharacter square={`${line}/4`} />
                <TileWithCharacter square={`${line}/5`} />
                <TileWithCharacter square={`${line}/6`} />
            </>
        );
    }, []);

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
    );
};

export default Battlefield;
