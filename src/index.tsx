import 'regenerator-runtime/runtime'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.scss'
// import './PhaserGame'
import muiTheme from './MuiTheme'
import MainApp from './MainApp'
import store from './stores'
import ApiService from './apis/ApiService'
import * as Sentry from '@sentry/react'
import { API_URL, SENDTRY_DSN } from './constant'
Sentry.init({
  dsn: SENDTRY_DSN,
  integrations: [Sentry.browserTracingIntegration(), Sentry.browserProfilingIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', API_URL],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
ApiService.getInstance()
const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider theme={muiTheme}>
      <MainApp />
    </ThemeProvider>
    <ToastContainer />
  </Provider>
  // </React.StrictMode>
)
