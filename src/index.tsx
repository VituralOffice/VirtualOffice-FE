import 'regenerator-runtime/runtime'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.scss'
// import './PhaserGame'
import muiTheme from './MuiTheme'
import App from './App'
import store from './stores'
import ApiService from './apis/ApiService'

// require('dotenv').config();

ApiService.getInstance()
const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={muiTheme}>
      <App />
    </ThemeProvider>
    <ToastContainer />
  </Provider>
  // </React.StrictMode>
)
