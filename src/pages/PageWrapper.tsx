import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../redux/slices/cosmeticsSlice'
import { AppDispatch } from '../redux/store'

export const PageWrapper = ({ title, children }: { title: string; children: ReactNode }): JSX.Element => {
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        document.title = t(`local:page_titles.${title}`)
    }, [title])

    useEffect(() => {
        // the reason for this "hook" is to allow external components to change the page title
        // (for example, game pages that have a dynamic title)
        dispatch(setPageTitle(t(title)))
    }, [])

    return <>{children}</>
}
