import React from 'react'
import { CharacterInLobby } from '@models/Redux'
import GameAsset from '@components/GameAsset'
import { apprf, cn } from '@utils'

const ShortCharacterInfo = ({
    character,
    controlledBy,
    onClick,
}: {
    character: CharacterInLobby
    controlledBy: string[]
    onClick: () => void
}) => {
    return (
        <div
            id={`short-info-${character.descriptor}`}
            className={cn('p-4 text-left bg-amber-100 w-96', apprf('hover', 'bg-green-800'))}
            onClick={onClick}
        >
            <div className={'flex min-h-10 min-w-10 flex-row items-center'}>
                <GameAsset src={character.sprite} alt={character.name} className={'size-10'} />
                <p
                    style={{
                        fontSize: '1.25rem',
                        lineHeight: '1.5rem',
                        textWrap: 'wrap',
                        fontWeight: 'bold',
                        marginLeft: '0.5rem',
                    }}
                >
                    {character.name} (@{character.descriptor})
                </p>
            </div>
            <p
                style={{
                    fontSize: '1rem',
                    lineHeight: '1.25rem',
                    textWrap: 'wrap',
                    fontWeight: 'normal',
                    color: 'gray',
                }}
            >
                Controlled by: {controlledBy.join(', ') || '-'}
            </p>
        </div>
    )
}

export default ShortCharacterInfo
