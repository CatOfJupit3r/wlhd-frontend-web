import { useSearchParams } from 'react-router-dom'
import CharacterInfoWrapper from '../components/CharacterDisplayTools/CharacterDisplayTools'

const ViewCharacterPage = () => {
    const [searchParams] = useSearchParams()

    return (
        <div>
            <CharacterInfoWrapper initialCharacter={searchParams.get('character') || ''} />
        </div>
    )
}

export default ViewCharacterPage
