export const VITE_BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export const VITE_CDN_URL: string = import.meta.env.VITE_CDN_URL || 'http://localhost:5000';
export const IS_DEVELOPMENT: boolean = import.meta.env.DEV;
export const SUPPORTED_DLCs = [
    {
        title: 'Builtins',
        descriptor: 'builtins',
    },
    {
        title: 'Nyrzamaer Tales',
        descriptor: 'nyrzamaer',
    },
];
export const FALLBACK_LANGUAGE = 'uk-UA';
export const SUPPORTED_DLCS_DESCRIPTORS = SUPPORTED_DLCs.map(({ descriptor }) => descriptor);
