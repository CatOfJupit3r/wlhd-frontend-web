import ReactDOM from 'react-dom/client';

import '@services/translation-service';

import './index.css';
import Main from './main';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<Main />);
