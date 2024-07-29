import { useSearchParams } from 'react-router-dom'
import ViewCharacter from '@components/ViewCharacter/ViewCharacter'

const ViewCharacterPage = () => {
    const [searchParams] = useSearchParams()

    return (
        <div>
            <ViewCharacter initial={searchParams.get('character') || null} />
        </div>
    )
}

export default ViewCharacterPage
