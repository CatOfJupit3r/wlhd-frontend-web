import { splitDescriptor } from '@utils/game-helpers';
import { VITE_CDN_URL } from 'config';

export const assetsHelpers = (dlc: string, descriptor: string) => {
    return `${VITE_CDN_URL}/game/${dlc}/assets/${descriptor.replace('.', '/')}`;
};
export const generateAssetPathFullDescriptor = (full_descriptor: string) => {
    const [dlc, descriptor] = splitDescriptor(full_descriptor);
    return assetsHelpers(dlc, descriptor);
};
