import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import { AwaitingButton } from '@components/ui/button'
import { Combobox } from '@components/ui/combobox'
import { Separator } from '@components/ui/separator'
import { StaticSkeleton } from '@components/ui/skeleton'
import UserAvatar from '@components/UserAvatars'
import { useViewCharactersContext } from '@context/ViewCharactersContext'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import APIService from '@services/APIService'
import { refreshLobbyInfo } from '@utils'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaXmark } from 'react-icons/fa6'
import { IoMdPersonAdd } from 'react-icons/io'
import { IoAdd } from 'react-icons/io5'
import { useSelector } from 'react-redux'

const Placeholder = () => {
    return (
        <div>
            <StaticSkeleton className={'h-6 w-[12ch]'} />
            <StaticSkeleton className={'mt-1 h-10 w-full'} />
        </div>
    )
}

const PlainListOfPlayers = () => {
    const lobby = useSelector(selectLobbyInfo)
    const { descriptor } = useViewCharactersContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.control-details',
    })

    return (
        <div className={'mt-2 flex flex-col gap-1'}>
            {lobby.players
                .filter((player) => player.characters && player.characters.includes(descriptor as string))
                .map((player, index) => {
                    return (
                        <div key={index} className={'relative flex flex-row items-center gap-2'}>
                            <UserAvatar handle={player.handle} className={'size-8'} />
                            <p className={'max-w-[75%]'}>@{player.handle}</p>
                            <AwaitingButton
                                id={'remove-player'}
                                onClick={
                                    descriptor && player.userId
                                        ? () => {
                                              return APIService.removePlayerFromCharacter(
                                                  lobby.lobbyId,
                                                  descriptor as string,
                                                  player.userId
                                              )
                                          }
                                        : undefined
                                }
                                thenCase={() => {
                                    refreshLobbyInfo(lobby.lobbyId).then()
                                }}
                                catchCase={(error) => {
                                    console.error('Error removing player', error)
                                }}
                                variant={'destructiveGhost'}
                                className={`absolute right-0 p-3 text-red-700 opacity-60 hover:text-destructive hover:opacity-100 active:border-red-600 active:text-red-600`}
                            >
                                <FaXmark className={'mr-1 size-4'} />
                                <p>{t('remove')}</p>
                            </AwaitingButton>
                        </div>
                    )
                })}
        </div>
    )
}

const AddNewPlayer = () => {
    const [playerToAdd, setPlayerToAdd] = useState<string>('')
    const lobby = useSelector(selectLobbyInfo)
    const { descriptor } = useViewCharactersContext()

    return (
        <div className={'flex h-10 flex-row gap-2'}>
            <Combobox
                items={lobby.players
                    .filter((player) => !player.characters || !player.characters.includes(descriptor as string))
                    .map((player) => ({
                        value: player.userId,
                        label: player.handle,
                        icon: () => (
                            <UserAvatar handle={player.handle} className={'size-8'} style={{ borderRadius: '50%' }} />
                        ),
                    }))}
                value={playerToAdd}
                onChange={(value) => {
                    setPlayerToAdd(value)
                }}
                size={{
                    height: 'h-full',
                }}
            />
            <AwaitingButton
                onClick={
                    descriptor && playerToAdd
                        ? () => {
                              return APIService.assignPlayerToCharacter(
                                  lobby.lobbyId,
                                  descriptor as string,
                                  playerToAdd
                              )
                          }
                        : undefined
                }
                thenCase={() => {
                    refreshLobbyInfo(lobby.lobbyId).then()
                }}
                catchCase={(error) => {
                    console.error('Error adding player', error)
                }}
                variant={'secondary'}
                className={'h-full'}
            >
                <IoAdd />
            </AwaitingButton>
        </div>
    )
}

export const CharacterControlInfo = () => {
    const lobby = useSelector(selectLobbyInfo)
    const { descriptor } = useViewCharactersContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.control-details',
    })

    const playersInControl = useMemo(
        () => lobby.players.filter((player) => player.characters && player.characters.includes(descriptor || '')),
        [lobby, descriptor]
    )

    if (!descriptor) {
        return <Placeholder />
    }

    return (
        <div className={'flex flex-col gap-2 rounded border-2 px-4 py-2'}>
            <Accordion type={'single'} collapsible className={'border-0'}>
                <AccordionItem value={'controlled-by'} className={'border-b-0'}>
                    <AccordionTrigger className={'text-base'}>
                        <div className={'flex flex-row items-center gap-1'}>
                            <p className={'text-wrap'}>{t('controlled-by')}</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className={'flex flex-col gap-2'}>
                            {playersInControl?.length > 0 ? (
                                <PlainListOfPlayers />
                            ) : (
                                <p className={'italic text-gray-400'}>{t('empty')}</p>
                            )}
                            <Separator />
                            {lobby.layout === 'gm' && (
                                <Accordion type={'single'} collapsible>
                                    <AccordionItem value={'add-new-player'}>
                                        <AccordionTrigger className={'text-base'}>
                                            <div className={'flex flex-row items-center gap-1'}>
                                                <IoMdPersonAdd />
                                                {t('add-player')}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <AddNewPlayer />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
