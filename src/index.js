// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the updated import path
import App from './App';

// Create a root.
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Initial render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
