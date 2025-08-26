// main.jsx (contoh)
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import store from './store'
import App from './App'
import './index.css'

const theme = {
  token: {
    fontFamily:
      '"Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontWeightStrong: 600, 
    fontSize: 16,
  },
  components: {
    Typography: {
      fontSizeHeading2: 40,
      lineHeightHeading2: 1.2,
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <ConfigProvider theme={theme}>
          <App />
        </ConfigProvider>
      </Provider>
    </HashRouter>
  </React.StrictMode>
)
