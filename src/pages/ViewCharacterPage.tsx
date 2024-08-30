import ViewCharacterLobby from '@components/ViewLobbyCharacters/ViewLobbyCharacters'
import { useSearchParams } from 'react-router-dom'

const ViewCharacterPage = () => {
    const [searchParams] = useSearchParams()

    return (
        <div>
            <ViewCharacterLobby initial={searchParams.get('character') || null} />
        </div>
    )
}

export default ViewCharacterPage
