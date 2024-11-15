export const VITE_BACKEND_APP: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
export const IS_DEVELOPMENT: boolean = import.meta.env.VITE_NODE_ENV === 'development'
export const SUPPORTED_DLCs = [
    {
        title: 'Builtins',
        descriptor: 'builtins',
    },
    {
        title: 'Nyrzamaer Tales',
        descriptor: 'nyrzamaer',
    },
]
export const SUPPORTED_DLCS_DESCRIPTORS = SUPPORTED_DLCs.map(({ descriptor }) => descriptor)
