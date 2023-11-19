import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <App />
);

reportWebVitals();
