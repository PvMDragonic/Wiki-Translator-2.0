import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
.use(HttpApi)
.use(LanguageDetector)
.use(initReactI18next)
.init({
    debug: false,
    fallbackLng: 
    {
        'pt-BR': ['pt'], 'pt-PT': ['pt'],
        'en-US': ['en'], 'en-GB': ['en'],
        'default': ['pt']
    },
    interpolation: 
    {
        escapeValue: false
    },
    backend: 
    {
        loadPath: './locales/{{lng}}/translation.json'
    }
});

export default i18n;