import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeScript } from "@chakra-ui/color-mode";

import App from './App.jsx'
import Theme from './Theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ChakraProvider theme={Theme}>
        <ColorModeScript initialColorMode={Theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </HashRouter>
  </React.StrictMode>,
);
