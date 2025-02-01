import InvitePlayerModal from '@components/LobbyInformation/Modals/InvitePlayerModal'
import { AlertDialogContent } from '@components/ui/alert-dialog'
import { FC } from 'react'
import { LOBBY_INFO_MODALS, LOBBY_INFO_MODALS_TYPE } from '../types'

interface iModalManager {
    current: null | LOBBY_INFO_MODALS_TYPE
    setCurrent: (value: null | LOBBY_INFO_MODALS_TYPE) => void
}

const ModalManagerInner: FC<iModalManager> = ({ current, setCurrent }) => {
    switch (current) {
        case LOBBY_INFO_MODALS.INVITE_PLAYERS:
            return <InvitePlayerModal closeModal={() => setCurrent(null)} />
        default:
            return null
    }
}

const ModalManager: FC<iModalManager> = ({ current, setCurrent }) => {
    return (
        <AlertDialogContent className={'w-full max-w-4xl'}>
            <ModalManagerInner current={current} setCurrent={setCurrent} />
        </AlertDialogContent>
    )
}

export default ModalManager
