import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { MathJaxContext } from 'better-react-mathjax';
import axios
  from 'axios';
const container = document.getElementById('root')!;
const root = createRoot(container);

const mathJaxConfig = {
  src: 'https://rozwiazania.dawidstachowiak.pl/static/js/tex-mml-chtml.js',
  tex: {
    digits: /^(?:[0-9]+(?:,[0-9]*)?|, [0-9]+)/
  }
}

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken') as string}`;

axios.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  if (error && error.response) {
    if (419 === error.response.status) {
      error.config._retry = true;
      await axios.get('/sanctum/csrf-cookie');
      return axios(error.config);
    } else if (401 === error.response.status) {
      window.location.href = '/auth';
    } else {
      return Promise.reject(error);
    }
  }
});

root.render(
  <Provider store={store}>
    <MathJaxContext config={mathJaxConfig}>
      <App />
    </MathJaxContext>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
