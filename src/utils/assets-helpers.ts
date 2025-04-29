import { CDN_PREFIX } from '@configuration';
import { splitDescriptor } from '@utils/game-helpers';

export const assetsHelpers = (dlc: string, descriptor: string) => {
    return `${CDN_PREFIX}/game/${dlc}/assets/${descriptor.replace('.', '/')}`;
};
export const generateAssetPathFullDescriptor = (full_descriptor: string) => {
    const [dlc, descriptor] = splitDescriptor(full_descriptor);
    return assetsHelpers(dlc, descriptor);
};
