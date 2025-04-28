import { GameComponentDecoration } from '@type-defs/GameModels';
import React from 'react';

import { HTMLIconFactoryProps } from '@components/icons/icon_factory';
import { getCharacterSide } from '@utils';
import { assetsHelpers, generateAssetPathFullDescriptor } from '@utils/assets-helpers';

const INVALID_ASSET_PATH: string = '/assets/local/invalid_asset.png';

const SET_ASSET_PROPS = (img: HTMLImageElement, fallback: { src: string; alt: string }) => {
    if (img.src === fallback.src || img.src === INVALID_ASSET_PATH) return;
    img.src = fallback.src || INVALID_ASSET_PATH;
    img.alt = fallback.alt || 'invalid asset';
};

interface GameAssetProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string | { dlc: string; descriptor: string };
    fallback?: {
        src: string;
        alt: string;
    };
}

const GameAsset = ({ src, fallback, alt, ...props }: GameAssetProps) => {
    return (
        <img
            {...props}
            alt={alt || 'asset'}
            src={
                typeof src === 'string' ? generateAssetPathFullDescriptor(src) : assetsHelpers(src.dlc, src.descriptor)
            }
            onError={(e) => {
                if (e.currentTarget.src === INVALID_ASSET_PATH) return;
                SET_ASSET_PROPS(e.currentTarget, fallback || { src: INVALID_ASSET_PATH, alt: 'invalid asset' });
            }}
        />
    );
};

export const CharacterGameAsset = ({ line, ...props }: GameAssetProps & { line: number }) => {
    return (
        <GameAsset
            {...props}
            fallback={
                line
                    ? getCharacterSide(line) === 'enemy'
                        ? {
                              src: generateAssetPathFullDescriptor('builtins:characters.enemy'),
                              alt: 'Unknown enemy',
                          }
                        : {
                              src: generateAssetPathFullDescriptor('builtins:characters.ally'),
                              alt: 'Unknown ally',
                          }
                    : undefined
            }
        />
    );
};

export const gameAssetToComboboxIcon = (component: { decorations: GameComponentDecoration }) => {
    return (props: HTMLIconFactoryProps) => <GameAsset src={component.decorations.sprite} alt={props.alt} {...props} />;
};

export default GameAsset;
