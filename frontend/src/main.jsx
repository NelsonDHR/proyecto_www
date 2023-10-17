import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import Theme from './Theme'

import { ChakraProvider } from '@chakra-ui/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ChakraProvider theme={Theme}>
        <App />
      </ChakraProvider>
    </HashRouter>
  </React.StrictMode>,
);
