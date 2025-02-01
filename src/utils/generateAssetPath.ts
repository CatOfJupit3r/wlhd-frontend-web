import { splitDescriptor } from '@utils/descriptorTools';
import { VITE_CDN_URL } from 'config';

export const generateAssetPath = (dlc: string, descriptor: string) => {
    return `${VITE_CDN_URL}/game/${dlc}/assets/${descriptor.replace('.', '/')}`;
};
export const generateAssetPathFullDescriptor = (full_descriptor: string) => {
    const [dlc, descriptor] = splitDescriptor(full_descriptor);
    return generateAssetPath(dlc, descriptor);
};
