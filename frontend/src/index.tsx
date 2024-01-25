import * as React from 'react';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './app/App';
import {store} from './app/store';
import './index.less';

const root = createRoot(document.getElementById('app') as HTMLElement);
root.render(
        <StrictMode>
            <Provider store={store}>
                <App/>
            </Provider>
        </StrictMode>
);
