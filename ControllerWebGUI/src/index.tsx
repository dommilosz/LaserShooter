import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ThemeProvider} from "./api/Theme";
import { MessageBoxProvider } from './components/DialogBoxComponents/MessageBoxContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <MessageBoxProvider>
                <App/>
            </MessageBoxProvider>
        </ThemeProvider>
    </React.StrictMode>
);
