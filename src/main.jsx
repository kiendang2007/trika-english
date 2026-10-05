import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const root = document.getElementById('root')
// Deploy check only: an attribute, never text.
root.setAttribute('data-build', __BUILD_TIME__)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
