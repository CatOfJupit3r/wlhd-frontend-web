import CommaSeparatedList from '@components/ui/coma-separated-list'
import StyledLink from '@components/ui/styled-link'
import UserAvatar from '@components/UserAvatars'
import useDualTranslation from '@hooks/useDualTranslation'
import { iLobbyPlayerInfo } from '@models/Redux'
import { FC } from 'react'

const LinkToPlayerCharacter: FC<{
    descriptor: string
    name: string
}> = ({ descriptor, name }) => {
    return (
        <StyledLink to={`./view-character?character=${descriptor}`}>
            {name} ({descriptor})
        </StyledLink>
    )
}

interface iPlayerDisplay {
    player: iLobbyPlayerInfo
}

const PlayerDisplay: FC<iPlayerDisplay> = ({ player: { handle, nickname, characters } }) => {
    const { t } = useDualTranslation('local', { keyPrefix: 'lobby-info.players' })

    return (
        <div key={handle} className="mb-4 flex w-full items-center space-x-2">
            <UserAvatar handle={handle} className={'size-10 border-2 shadow-none'} />
            <div className={'max-w-[90%]'}>
                <p className="font-medium">
                    {nickname} (@{handle})
                </p>
                <p className="flex flex-row gap-1 text-sm text-muted-foreground">
                    {t('playing-as')}{' '}
                    <CommaSeparatedList
                        items={characters}
                        renderItem={([descriptor, name]) => (
                            <LinkToPlayerCharacter descriptor={descriptor} name={t(name, { includePrefix: false })} />
                        )}
                        emptyMessage={t('no-characters')}
                    />
                </p>
            </div>
        </div>
    )
}

export default PlayerDisplay
