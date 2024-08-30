import { splitDescriptor } from '@utils/descriptorTools'
import { REACT_APP_BACKEND_URL } from 'config'

export const generateAssetPath = (dlc: string, descriptor: string) => {
    return `${REACT_APP_BACKEND_URL}/assets/${dlc}/${descriptor}`
}
export const generateAssetPathFullDescriptor = (full_descriptor: string) => {
    const [dlc, descriptor] = splitDescriptor(full_descriptor)
    return generateAssetPath(dlc, descriptor)
}
