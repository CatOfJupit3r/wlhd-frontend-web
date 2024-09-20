export const VITE_BACKEND_APP: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
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
