import QueryClient from '@queries/QueryClient'
import RootRouter from '@router/RootRouter'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const App = () => {
    return (
        <QueryClientProvider client={QueryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <div className={'App'}>
                <RootRouter />
            </div>
        </QueryClientProvider>
    )
}

export default App
