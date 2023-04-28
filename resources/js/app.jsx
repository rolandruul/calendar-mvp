import 'normalize.css';
import './bootstrap';
import './../scss/app.scss';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} &mdash; ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
});
