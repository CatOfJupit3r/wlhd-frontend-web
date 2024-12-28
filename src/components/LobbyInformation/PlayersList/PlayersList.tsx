import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { ScrollArea } from '@components/ui/scroll-area'
import { iLobbyInformation, iLobbyPlayerInfo } from '@models/Redux'
import { cn } from '@utils'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FaUserPlus } from 'react-icons/fa6'
import { LuUsers } from 'react-icons/lu'
import PlayerDisplay from './PlayerDisplay'

interface iPlayersList {
    className?: string
    players: Array<iLobbyPlayerInfo>
    layout: iLobbyInformation['layout']
}

const PlayersList: FC<iPlayersList> = ({ className, players, layout }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'lobby-info.players',
    })
    return (
        <Card>
            <CardHeader className={'flex flex-row items-center justify-between'}>
                <CardTitle>
                    <LuUsers className={'mr-2 inline-block'} />
                    {t('title')}
                </CardTitle>
                <div className={''}>
                    {layout === 'gm' ? (
                        <Button className={'h-8 text-sm'}>
                            <FaUserPlus className={'mr-2 inline-block'} />
                            {t('invite-players')}
                        </Button>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className={cn(className, 'h-[300px]')}>
                    <div className={'flex w-full flex-col gap-2 border-0 p-0'}>
                        {players.map((player) => {
                            return <PlayerDisplay player={player} key={player.handle} />
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default PlayersList
