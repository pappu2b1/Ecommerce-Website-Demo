import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './AppApi';
import {StoreProvider} from './context/StoreContext';
import {CatalogProvider} from './context/CatalogContext';
import './styles/app.css';
import './styles/responsive-fixes.css';
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><StoreProvider><CatalogProvider><App/></CatalogProvider></StoreProvider></BrowserRouter></React.StrictMode>);
