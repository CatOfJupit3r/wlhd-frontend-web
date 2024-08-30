import { store } from '@redux/store'
import '@services/i18n'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './styles/index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <Provider store={store}>
        <App />
    </Provider>
)
