import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import App from './App';
import reportWebVitals from './reportWebVitals';
import "../src/assets/scss/style.scss";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { ModalProvider } from '@pantherswap-libs/uikit'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import { ThemeContextProvider } from './ThemeProvider'

export default function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 15000
  return library
}

const history = createBrowserHistory();

ReactDOM.render(
    <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeContextProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </ThemeContextProvider>
      </Web3ReactProvider>
    </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
