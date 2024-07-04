import CharacterInfoWrapper from '@components/CharacterDisplayTools/CharacterDisplayTools'
import { useSearchParams } from 'react-router-dom'

const ViewCharacterPage = () => {
    const [searchParams] = useSearchParams()

    return (
        <div>
            <CharacterInfoWrapper initialCharacter={searchParams.get('character') || ''} />
        </div>
    )
}

export default ViewCharacterPage
