import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Home } from '@pages/Home';
import i18n from './config/i18next';
import './config/i18next';
import './scss/main.scss';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <I18nextProvider i18n = {i18n}>
            <Home/>
        </I18nextProvider>
    </StrictMode>,
);