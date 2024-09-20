import { splitDescriptor } from '@utils/descriptorTools'
import { VITE_BACKEND_APP } from 'config'

export const generateAssetPath = (dlc: string, descriptor: string) => {
    return `${VITE_BACKEND_APP}/assets/${dlc}/${descriptor}`
}
export const generateAssetPathFullDescriptor = (full_descriptor: string) => {
    const [dlc, descriptor] = splitDescriptor(full_descriptor)
    return generateAssetPath(dlc, descriptor)
}
