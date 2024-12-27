import { useLayoutContext } from '@context/LayoutContext'
import { iRouteConfig } from '@models/IRouteConfig'
import PseudoPage from '@pages/PseudoPage'
import { setPageTitle } from '@redux/slices/cosmeticsSlice'
import { AppDispatch } from '@redux/store'
import { ReactNode, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

export const PageWrapper = ({ config, children }: { config: iRouteConfig; children: ReactNode }): JSX.Element => {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()
    const { changeConfig } = useLayoutContext()

    // Group related effects together
    useEffect(() => {
        // Set both document title and redux state
        const translatedTitle = t(`local:page_titles.${config.title}`)
        document.title = translatedTitle
        dispatch(setPageTitle(translatedTitle))
    }, [config.title, t, dispatch])

    useEffect(() => {
        changeConfig(config)

        // Add cleanup function
        return () => {
            // Reset layout config when component unmounts
            changeConfig(null)
        }
    }, [config, changeConfig])

    return <Suspense fallback={<PseudoPage />}>{children}</Suspense>
    // return <>{children}</>
}
