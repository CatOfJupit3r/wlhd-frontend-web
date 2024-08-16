import { useSearchParams } from 'react-router-dom'
import ViewCharacterLobby from '@components/ViewLobbyCharacters/ViewLobbyCharacters'

const ViewCharacterPage = () => {
    const [searchParams] = useSearchParams()

    return (
        <div>
            <ViewCharacterLobby initial={searchParams.get('character') || null} />
        </div>
    )
}

export default ViewCharacterPage
