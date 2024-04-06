import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { TranslatableString } from '../models/Battlefield'

const useTranslatableString = () => {
    const { t } = useTranslation()

    const formTranslation = useCallback(
        (msg: TranslatableString) => {
            if (msg.format_args === undefined) {
                return t(msg.main_string)
            }
            const keys = Object.keys(msg.format_args)
            const newArgs: { [key: string]: string } = {}
            for (const key of keys) {
                const arg = msg.format_args[key]
                if (typeof arg === 'string') {
                    newArgs[key] = arg
                } else {
                    newArgs[key] = formTranslation(arg)
                }
            }
            return t(msg.main_string, newArgs)
        },
        [t]
    )

    return formTranslation
}

export default useTranslatableString
