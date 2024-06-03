import { useNavigate, useSearchParams } from 'react-router-dom'
import CharacterInfoWrapper from '../components/CharacterDisplayTools/CharacterDisplayTools'

const ViewCharacterPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    return (
        <div>
            <button onClick={() => navigate('..', { relative: 'path' })}>Back to lobby</button>
            <CharacterInfoWrapper initialCharacter={searchParams.get('character') || ''} />
        </div>
    )
}

export default ViewCharacterPage
