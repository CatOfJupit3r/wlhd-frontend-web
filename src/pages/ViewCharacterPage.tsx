import ViewCharacterLobby from '@components/ViewLobbyCharacters/ViewLobbyCharacters'
import { useSearchParams } from 'react-router'

const ViewCharacterPage = () => {
    const [searchParams] = useSearchParams()

    return (
        <div>
            <ViewCharacterLobby initial={searchParams.get('character') || null} />
        </div>
    )
}

export default ViewCharacterPage
