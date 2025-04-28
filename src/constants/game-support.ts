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
export const SUPPORTED_DLCS_DESCRIPTORS: Array<SupportedDLCs> = SUPPORTED_DLCs.map(({ descriptor }) => descriptor);
export type SupportedDLCs = (typeof SUPPORTED_DLCs)[number]['descriptor'];
