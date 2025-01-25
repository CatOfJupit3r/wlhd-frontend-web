import { QueryClient } from '@tanstack/react-query'

export default new QueryClient({
    defaultOptions: {
        queries: {
            // stale time indicates how long a query can be cached for before it's considered stale
            staleTime: 5 * 60 * 1000, // 5 minutes
            // retry attempts indicates how many times a query can be retried before it's considered failed
            retry: 2,
            // retryDelayTime indicates how long to wait before retrying a query
            retryDelay: 1000,
            // refetchInterval indicates how long to keep a query in cache before checking with the server
            refetchInterval: 30 * 60 * 1000, // 5 minutes
        },
    },
})
