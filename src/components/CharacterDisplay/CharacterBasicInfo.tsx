import React from 'react'
import GameAsset from '@components/GameAsset'
import { generateAssetPathFullDescriptor } from '@components/Battlefield/utils'

const CharacterBasicInfo = ({
    includeSquare = true,
    includeDescription = true,
    character,
}: {
    includeSquare?: boolean
    includeDescription?: boolean
    character: {
        name: string
        sprite: string
        description: string | null
        square: {
            line: string
            column: string
        } | null
    }
}) => {
    return (
        <div className={'flex flex-row gap-4'}>
            <div>
                <GameAsset
                    src={character.sprite}
                    alt={character.name}
                    className={'size-20'}
                    fallback={
                        character.square && ['1', '2', '3'].includes(character.square.line)
                            ? {
                                  src: generateAssetPathFullDescriptor('builtins:enemy'),
                                  alt: 'Unknown enemy',
                              }
                            : {
                                  src: generateAssetPathFullDescriptor('builtins:ally'),
                                  alt: 'Unknown ally',
                              }
                    }
                />
            </div>
            <div>
                <div className={'text-ellipsis text-t-normal font-bold'}>{character.name}</div>
                {includeSquare && character.square && (
                    <div className={'text-t-smaller'}>
                        Square: {character.square.line}/{character.square.column}
                    </div>
                )}
                {includeDescription && <div className={'text-wrap text-t-smaller italic text-gray-400'}>{character.description}</div>}
            </div>
        </div>
    )
}

export default CharacterBasicInfo
