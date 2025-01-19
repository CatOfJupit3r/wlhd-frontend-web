import DLCContents from '@components/GameWiki/DLCContents'
import WikiDLCChoice from '@components/GameWiki/WikiDLCChoice'
import { useGameWikiContext } from '@context/GameWikiContext'
import paths from '@router/paths'
import { SUPPORTED_DLCS_DESCRIPTORS } from 'config'
import { FC, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'

interface iGameWiki {}

const GameWiki: FC<iGameWiki> = () => {
    const { dlc: paramDLC } = useParams()
    const isValidDLCName = useMemo(() => !!(paramDLC && SUPPORTED_DLCS_DESCRIPTORS.includes(paramDLC)), [paramDLC])
    const navigate = useNavigate()
    const { changeDlc } = useGameWikiContext()

    useEffect(() => {
        if (!paramDLC) return
        if (isValidDLCName) {
            changeDlc(paramDLC)
        } else {
            navigate(paths.wiki)
        }
    }, [paramDLC])

    return <div className={'size-full'}>{isValidDLCName ? <DLCContents /> : <WikiDLCChoice />}</div>
}

export default GameWiki
