import {IMAGE_SIZE} from "../config/constants";

export async function importAsset(
    path: string,
    options?: { resize?: boolean; dimensions?: number}): Promise<string> {
    try {
        let assetUrl: string;

        if (options?.resize) {
            const dimensions = options.dimensions || IMAGE_SIZE;
            const imagePath = `../${path}`;

            assetUrl = await resizeImage(imagePath, dimensions);
            console.log(assetUrl)
        } else {
            const asset = await import(`../${path}`);
            assetUrl = asset.default || asset;
        }

        return assetUrl;
    } catch (error) {
        console.error(`Error loading asset at path ${path}:`, error);
        return '';
    }
}


async function resizeImage(imagePath: string, dimensions: number): Promise<string> {
    const image = new Image();
    image.src = imagePath;

    await new Promise(resolve => {
        image.onload = () => resolve(null);
    });

    const canvas = document.createElement('canvas');
    canvas.width = dimensions;
    canvas.height = dimensions;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to obtain 2D canvas context');
    }

    ctx.drawImage(image, 0, 0, dimensions, dimensions);

    return canvas.toDataURL();
}
