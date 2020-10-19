import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'dropify/dist/js/dropify';
import App from './containers/app';

function importAll (r) {
    r.keys().forEach(r);
}
importAll(require.context('./', true, /\.scss$/));

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));