import './bootstrap';
import '../css/app.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import React from 'react';
import { createRoot } from 'react-dom/client';
import PharmacyApp from './PharmacyApp';

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<PharmacyApp />);
}
