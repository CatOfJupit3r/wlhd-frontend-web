import { TranslatableString } from '@models/GameModels'
import { isDescriptor } from '@utils'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const useTString = () => {
    const { t } = useTranslation()

    const formTranslation = useCallback(
        (msg: TranslatableString): string => {
            if (!('format_args' in msg)) {
                return t(msg.main_string)
            }
            const keys = Object.keys(msg.format_args)
            const newArgs: { [key: string]: string } = {}
            for (const key of keys) {
                const arg = msg.format_args[key]
                if (typeof arg === 'string') {
                    // only translate if it is a descriptor
                    if (isDescriptor(arg)) {
                        newArgs[key] = t(arg)
                    } else {
                        newArgs[key] = arg
                    }
                } else if (typeof arg === 'object' && ('main_string' in arg || 'format_args' in arg)) {
                    // this captures nested translatable strings
                    newArgs[key] = formTranslation(arg)
                } else {
                    // however, as of latest update it is possible for number, boolean, etc to be passed as arguments
                    // in this case, we just pass them as is
                    newArgs[key] = arg
                }
            }
            return t(msg.main_string, newArgs)
        },
        [t]
    )

    return {
        TString: formTranslation,
    }
}

export default useTString
