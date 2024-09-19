import { setPageTitle } from '@redux/slices/cosmeticsSlice'
import { AppDispatch } from '@redux/store'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { RouteConfig } from '@models/RouteConfig'
import { useLayoutContext } from '@context/LayoutContext'

export const PageWrapper = ({ config, children }: { config: RouteConfig; children: ReactNode }): JSX.Element => {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()
    const { changeConfig } = useLayoutContext()

    useEffect(() => {
        document.title = t(`local:page_titles.${config.title}`)
    }, [config.title])

    useEffect(() => {
        changeConfig(config)
    }, [config])

    useEffect(() => {
        // the reason for this "effect" is to allow external components to change the page title
        // (for example, game pages that have a dynamic title)
        dispatch(setPageTitle(t(config.title)))
    }, [])

    return <>{children}</>
}
