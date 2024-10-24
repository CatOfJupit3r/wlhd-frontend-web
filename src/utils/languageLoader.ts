import en_US from '../locales/en_US.json'
import ua_UK from '../locales/ua_UK.json'

export const getLanguageFiles = (): {
    [key: string]: {
        local: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: string | any
        }
    }
} => {
    return {
        'en-US': {
            local: en_US,
        },
        'uk-UA': {
            local: ua_UK,
        },
    }
}
