import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './redux/store';
import {Provider} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
// https://stackoverflow.com/questions/76337860/restrict-bootstrap-to-specific-react-components-only
import './i18n'
import {GAME_API_URL} from "./config/configs";

console.log(GAME_API_URL)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
