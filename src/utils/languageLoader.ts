import en_US from '../locales/en_US.json'
import ua_UK from '../locales/ua_UK.json'

export const getLanguageFiles = (): {
    [key: string]: {
        local: {
            [key: string]: string
        }
    }
} => {
    return {
        "en-US": {
            "local": en_US
        },
        "uk-UA": {
            "local": ua_UK
        }
    }
}
