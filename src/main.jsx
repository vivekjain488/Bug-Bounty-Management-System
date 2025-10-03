import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { createDemoAccounts } from './utils/demoAccounts'

// Create demo accounts for testing
createDemoAccounts();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

